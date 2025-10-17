import { useEffect, useState } from "react";
import { MovieCollection } from "../models/MovieCollection";
import { useMovieCollectionById } from "../API/MovieCollectionApi";
import { useNavigate, useParams } from "react-router-dom";
import SortReviewModule from "../components/review_components/SortReviewsModle";
import MovieCollectionReviewCard from "../components/review_components/MovieCollectionReviewCard";
import { MovieCollectionReview } from "../models/MovieCollectionReview";
import PaginationModule from "../components/SharedModals/PaginationModule";
import { isUserMod } from "../hooks/decodeJWT";
import { useCollectionReviewsByCollectionId, useDeleteCollectionReview, useEditCollectionReview } from "../API/CollectionReviewApi";
import AddMovieCollectionReviewModal from "../components/review_components/AddMovieCollectionReview";
import { fetchReplyCountsByReviewIds } from "../API/ReplyUniwersalApi";
import MovieCollectionCard from "../components/MovieCollection_components/MovieCollectionCard";
import { fetchRelationsData } from "../API/RelationApi";
import SpinnerLoader from "../components/SpinnerLoader";
import ActionPendingModal from "../components/SharedModals/ActionPendingModal";

const MovieCollectionReviewsPage = () => {
  const navigate = useNavigate();
  const { id, userName } = useParams();
  const loggedUser = localStorage.getItem("logged_username") || "";
  const [sortOrder, setSortOrder] = useState<string>("rating");
  const [sortDirection, setSortDirection] = useState<string>("desc");
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ totalItems: 1, pageNumber: 1, pageSize: 5, totalPages: 1 });
  const [isLoggedUserMod, setIsLoggedUserMod] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState<MovieCollectionReview | null>();
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [repliesAmount, setRepliesAmount] = useState<number[]>([]);
  const [relations, setRelations] = useState<any>(null);
  const areSpoilersOn = false;

  //Api hooks:
  const { data: movieCollection = null, isLoading: movieCollectionLoading, error: movieCollectionError } = useMovieCollectionById(id);
  const { data: collectionReviewsData, isLoading: reviewsLoading, error: reviewsError } = useCollectionReviewsByCollectionId(id, pagination.pageNumber, pagination.pageSize, sortOrder, sortDirection);
  const reviews = collectionReviewsData?.reviews ?? [];
  const totalPages = collectionReviewsData?.totalPages ?? 1;
  //Mutacje
  const { mutate: deleteReview, isPending: isDeletingReview, error: deleteReviewError } = useDeleteCollectionReview();
  const { mutate: editReview, isPending: isEditingReview, error: editError } = useEditCollectionReview();

  //Funkcje
  const onDeleteReview = async (reviewId: string | undefined) => {
    deleteReview(reviewId);
  };

  const onEditReview = (review: MovieCollectionReview | null) => {
    setReviewToEdit(review);
    setShowEditModal(true);
  };

  const handleSaveEditedReview = async (reviewText: string, rating: number) => {
    if (!reviewToEdit) return;
    editReview({ reviewId: reviewToEdit.movieCollectionReviewId, updatedReview: { comment: reviewText, rating } }, {
      onSuccess: () => {
        setShowEditModal(false);
        setReviewToEdit(null);
      },
    });
  };

  useEffect(() => {
    if (loggedUser) {
      fetchRelationsData(
        localStorage.getItem("logged_username")!,
        "",
        setRelations,
        setError,
        navigate
      );
    }
  }, [id, sortOrder, sortDirection, pagination.pageNumber, pagination.pageSize]);

  useEffect(() => {
    if (movieCollection && movieCollection?.userName !== userName) {
      navigate("/404"); //jeżeli user w url nie jest właścicielem kolekcji leci na 404
    }
  }, [movieCollection]);

  useEffect(() => {
    setIsLoggedUserMod(isUserMod());
  }, []);

  useEffect(() => {
    try {
      const reviewsListIds = reviews.map((r) => r.movieCollectionReviewId);
      if (reviewsListIds.length > 0) {
        fetchReplyCountsByReviewIds(
          "MovieCollectionReviewReplies",
          reviewsListIds,
          setRepliesAmount,
          setError
        );
      }
    } catch (err) {
      console.error("Błąd podczas pobierania ilości odpowiedzi:", err);
    }
  }, [reviews]);

  const getReplyCountForReview = (reviewId: string) => {
    const index = reviews.findIndex(
      (r) => r.movieCollectionReviewId === reviewId
    );
    return index !== -1 && repliesAmount[index] !== undefined
      ? repliesAmount[index]
      : 0;
  };

  const handleSortChange = (category: string) => {
    console.log(repliesAmount);
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

  const isFriend = relations?.$values.some(
    (relation: any) =>
      relation.type === "Friend" &&
      relation.relatedUserName === movieCollection?.userName
  );
  const isBlocked = relations?.$values.some(
    (relation: any) =>
      relation.type === "Blocked" &&
      relation.relatedUserName === movieCollection?.userName
  );

  if (isBlocked) {
    navigate("/"); //W przypadku bloka przenosi na /
    return null;
  }

  if (
    movieCollection?.shareMode === "Private" &&
    loggedUser != movieCollection.userName &&
    !isLoggedUserMod
  )
    return <p>Ta kolekcja jest prywatna</p>;
  if (
    movieCollection?.shareMode === "Friends" &&
    loggedUser != movieCollection.userName &&
    !isLoggedUserMod &&
    !isFriend
  )
    return (
      <p>{`Ta kolekcja jest dostępna tylko dla znajomych użytkownika ${movieCollection.userName}`}</p>
    );

  if (error) {
    return <div className="text-danger text-center">{error}</div>;
  }

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
            <div className="d-flex justify-content-center align-items-center" style={{ height: "250px" }}>
              <SpinnerLoader />
            </div>
          ) : movieCollection ? (
            <MovieCollectionCard
              movieCollection={movieCollection}
              loggedUserName={loggedUser}
              isLoggedUserMod={isLoggedUserMod}
              isFriend={isFriend}
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

            {reviewsLoading ? (
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
                    commentCount={getReplyCountForReview(review.movieCollectionReviewId)}
                    displayCommentCount
                  />
                ))
            ) : (
              <p>Brak recenzji dla tej kolekcji.</p>
            )}
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
        <AddMovieCollectionReviewModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          onAddReview={handleSaveEditedReview}
          initialReviewText={reviewToEdit.comment}
          initialReviewRating={reviewToEdit.rating}
        />
      )}

      <ActionPendingModal show={isDeletingReview} message="Trwa usuwanie recenzji..."/>
      <ActionPendingModal show={isEditingReview} message="Trwa zapisywanie recenzji..."/>
    </div>
  );
};

export default MovieCollectionReviewsPage;