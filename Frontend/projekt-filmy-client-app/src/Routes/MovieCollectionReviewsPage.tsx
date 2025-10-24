import { useEffect, useState } from "react";
import { useMovieCollectionById } from "../API/MovieCollectionApi";
import { useParams } from "react-router-dom";
import SortReviewModule from "../components/review_components/SortReviewsModle";
import MovieCollectionReviewCard from "../components/review_components/MovieCollectionReviewCard";
import { MovieCollectionReview } from "../models/MovieCollectionReview";
import PaginationModule from "../components/SharedModals/PaginationModule";
import { isUserMod } from "../hooks/decodeJWT";
import { useCollectionReviewsByCollectionId, useDeleteCollectionReview, useEditCollectionReview } from "../API/CollectionReviewApi";
import MovieCollectionCard from "../components/MovieCollection_components/MovieCollectionCard";
import SpinnerLoader from "../components/SpinnerLoader";
import ActionPendingModal from "../components/SharedModals/ActionPendingModal";
import { useReplyCountsByReviewIds } from "../API/ReplyUniwersalApi";
import ApiErrorDisplay from "../components/ApiErrorDisplay";
import { toast } from "react-toastify";
import { getApiError } from "../functions/getApiError";
import AddReviewModal from "../components/review_components/AddReviewModal";

const MovieCollectionReviewsPage = () => {
  const { id } = useParams();
  const loggedUser = localStorage.getItem("logged_username") || "";
  const [sortOrder, setSortOrder] = useState<string>("rating");
  const [sortDirection, setSortDirection] = useState<string>("desc");
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ totalItems: 1, pageNumber: 1, pageSize: 5, totalPages: 1 });
  const [isLoggedUserMod, setIsLoggedUserMod] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState<MovieCollectionReview | null>();
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const areSpoilersOn = false;

  //Api hooks:
  const { data: movieCollection = null, isLoading: movieCollectionLoading, apiError: movieCollectionError} = useMovieCollectionById(id);
  const { data: collectionReviewsData, isLoading: reviewsLoading, apiError: reviewsError } = useCollectionReviewsByCollectionId(id, pagination.pageNumber, pagination.pageSize, sortOrder, sortDirection);
  const reviews = collectionReviewsData?.reviews ?? [];
  const totalPages = collectionReviewsData?.totalPages ?? 1;
  const { data: replyCounts = {}, isLoading: repliesLoading, apiError: repliesError } = useReplyCountsByReviewIds("MovieCollectionReviewReplies", reviews);
  //Mutacje
  const { mutate: deleteReview, isPending: isDeletingReview } = useDeleteCollectionReview();
  const { mutate: editReview, isPending: isEditingReview } = useEditCollectionReview();

  //Funkcje
  const onDeleteReview = async (reviewId: string | undefined) => {
    deleteReview(reviewId, {
      onSuccess: () => {
        toast.success("Recenzja została pomyślnie usunięta.");
      },
      onError: (err) => {
        const apiErr = getApiError(err);
        toast.error(`Nie udało się usunąć recenzji. [${apiErr?.statusCode}] ${apiErr?.message}`);
      },
    });
  };

  const onEditReview = (review: MovieCollectionReview | null) => {
    setReviewToEdit(review);
    setShowEditModal(true);
  };

  const handleSaveEditedReview = async (reviewText: string, rating: number) => {
    if (!reviewToEdit) return;
    editReview({ reviewId: reviewToEdit.movieCollectionReviewId, updatedReview: { comment: reviewText, rating } }, {
      onSuccess: () => {
        toast.success(`Recenzja została pomyślnie zedytowana.`);
        setShowEditModal(false);
        setReviewToEdit(null);
      },
      onError: (err) => {
        const apiErr = getApiError(err);
        toast.error(`Nie udało się edytować recenzji. [${apiErr?.statusCode}] ${apiErr?.message}`);
      },
    });
  };

  useEffect(() => {
    setIsLoggedUserMod(isUserMod());
  }, []);

  const handleSortChange = (category: string) => {
    switch (category) {
      case "highRaiting":
        setSortOrder("rating");
        setSortDirection("desc");
        break;
      case "lowRaiting":
        setSortOrder("rating");
        setSortDirection("asc");
        break;
      case "new":
        setSortOrder("year");
        setSortDirection("desc");
        break;
      case "old":
        setSortOrder("year");
        setSortDirection("asc");
        break;
      default:
        break;
    }
  };

  return (
    <div
      className=" container-fluid text-white"
      style={{ marginBottom: "2%", minHeight: "90vh" }}
    >
      <div className="m-4">
        <h2
          style={{ color: "white" }}
        >{`Recenzje kolekcji ${movieCollection?.title}`}</h2>
        <div style={{ marginTop: "2%" }}>
          <div className="d-flex justify-content-center">
            {movieCollectionLoading ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "250px" }}
              >
                <SpinnerLoader />
              </div>
            ) : movieCollectionError ? (
              <ApiErrorDisplay apiError={movieCollectionError} />
            ) : movieCollection ? (
              <MovieCollectionCard
                movieCollection={movieCollection}
                loggedUserName={loggedUser}
                isLoggedUserMod={isLoggedUserMod}
                isFriend={false}
                userPage={false}
                setError={setError}
              />
            ) : (
              <p>Nie udało się wczytać kolekcji.</p>
            )}
          </div>
          <div
            className="container pt-3 text-center"
            style={{ marginTop: "10px", marginBottom: "40px" }}
          >
            <div
              className="d-flex align-items-center ms-3"
              style={{ gap: "1rem" }}
            >
              {/* <div className="d-flex align-items-center">
                <Form.Check
                  type="checkbox"
                  id="spoiler-check"
                  checked={areSpoilersOn}
                  onChange={(e) => setAreSpoilersOn(e.target.checked)}
                  className="me-2 ms-3"
                />
                <label htmlFor="spoiler-check" className="mb-0 text-white">
                  Spoilery
                </label>
              </div>  */}
              <SortReviewModule onSort={handleSortChange} />
            </div>

            <ApiErrorDisplay apiError={reviewsError || repliesError}>
              {reviewsLoading || repliesLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                  <SpinnerLoader />
                </div>
              ) : reviews.length > 0 ? (
                reviews
                  .filter((review) => areSpoilersOn || review.spoilers === false)
                  .map((review) => (
                    <MovieCollectionReviewCard
                      key={review.movieCollectionReviewId}
                      movieCollectionReview={review}
                      movieCollection={movieCollection}
                      isLoggedUserMod={isLoggedUserMod}
                      userPage={true}
                      onEdit={() => onEditReview(review)}
                      onDelete={() => onDeleteReview(review?.movieCollectionReviewId)}
                      commentCount={replyCounts[review.movieCollectionReviewId] ?? 0}
                      displayCommentCount
                    />
                  ))
              ) : (
                <p>Brak recenzji dla tej kolekcji.</p>
              )}
            </ApiErrorDisplay>
          </div>
          <PaginationModule
            currentPage={pagination.pageNumber}
            totalPages={totalPages}
            onPageChange={(page) =>
              setPagination((prev) => ({ ...prev, pageNumber: page }))
            }
          />
        </div>
      </div>
      {reviewToEdit && (
        <AddReviewModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          onAddReview={handleSaveEditedReview}
          initialReviewText={reviewToEdit.comment}
          initialReviewRating={reviewToEdit.rating}
          headerText={"Edytuj recenzję kolekcji"} 
          buttonText={"Edytuj recenzję"}   
        />
      )}

      <ActionPendingModal show={isDeletingReview} message="Trwa usuwanie recenzji..."/>
      <ActionPendingModal show={isEditingReview} message="Trwa zapisywanie recenzji..."/>
    </div>
  );
};

export default MovieCollectionReviewsPage;