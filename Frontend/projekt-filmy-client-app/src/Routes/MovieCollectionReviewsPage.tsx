import { useEffect, useState } from "react";
import { MovieCollection } from "../models/MovieCollection";
import {
  fetchMovieCollectionById,
  fetchMovieCollectionReviews,
} from "../API/movieCollectionApi";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Form } from "react-bootstrap";
import SortReviewModule from "../components/review_components/SortReviewsModle";
import MovieCollectionReviewCard from "../components/review_components/MovieCollectionReviewCard";
import { MovieCollectionReview } from "../models/MovieCollectionReview";
import PaginationModule from "../components/SharedModals/PaginationModule";
import { isUserMod } from "../hooks/decodeJWT";
import { deleteReviewMC, editReviewMC } from "../API/CollectionReviewAPI";
import AddMovieCollectionReviewModal from "../components/review_components/AddMovieCollectionReview";
import { fetchReplyCountsByReviewIds } from "../API/ReplyUniwersalAPI";

const MovieCollectionReviewsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userName = localStorage.getItem("logged_username") || "";
  const [movieCollection, setMovieCollection] =
    useState<MovieCollection | null>(null);
  const [reviews, setReviews] = useState<MovieCollectionReview[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("rating");
  const [sortDirection, setSortDirection] = useState<string>("desc");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({
    totalItems: 1,
    pageNumber: 1,
    pageSize: 5,
    totalPages: 1,
  });

  const [isLoggedUserMod, setIsLoggedUserMod] = useState(false);
  const [areSpoilersOn, setAreSpoilersOn] = useState(false);
  const [reviewToEdit, setReviewToEdit] =
    useState<MovieCollectionReview | null>();
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [repliesAmount, setRepliesAmount] = useState<number[]>([]);

  const onEditReview = (review: MovieCollectionReview | null) => {
    setReviewToEdit(review);
    setShowEditModal(true);
  };

  const onDeleteReview = async (reviewId: string | undefined) => {
    try {
      await deleteReviewMC(reviewId, setReviews);
      if (id) {
        await fetchMovieCollectionReviews(
          id,
          setReviews,
          setError,
          setLoading,
          setPagination,
          sortOrder,
          sortDirection,
          pagination.pageNumber,
          pagination.pageSize
        );
        fetchMovieCollectionById(id, setMovieCollection, setError);
      }
    } catch (err) {
      console.error("Błąd podczas usuwania recenzji:", err);
    }
  };

  const handleSaveEditedReview = async (reviewText: string, rating: number) => {
    if (reviewToEdit) {
      try {
        await editReviewMC(
          reviewToEdit.movieCollectionReviewId,
          { comment: reviewText, rating },
          setReviews,
          setError
        );
        if (id) {
          await fetchMovieCollectionReviews(
            id,
            setReviews,
            setError,
            setLoading,
            setPagination,
            sortOrder,
            sortDirection,
            pagination.pageNumber,
            pagination.pageSize
          );

          fetchMovieCollectionById(id, setMovieCollection, setError);
        }
      } catch (err) {
        console.error("Błąd podczas edycji recenzji:", err);
        setError("Nie udało się edytować recenzji.");
      } finally {
        setShowEditModal(false);
        setReviewToEdit(null);
      }
    }
  };

  useEffect(() => {
    fetchMovieCollectionById(id, setMovieCollection, setError);
    fetchMovieCollectionReviews(
      id,
      setReviews,
      setError,
      setLoading,
      setPagination,
      sortOrder,
      sortDirection,
      pagination.pageNumber,
      pagination.pageSize
    );
  }, [
    id,
    sortOrder,
    sortDirection,
    pagination.pageNumber,
    pagination.pageSize,
  ]);

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

  if (loading) {
    return <div className="text-center">Ładowanie recenzji...</div>;
  }

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
            <div
              className="mt-4  bg-white p-3 shadow-sm d-flex gap-3 align-items-stretch"
              style={{
                height: "30vh",
                paddingRight: "10px",
                borderRadius: "20px",
                width: "80%",
              }}
            >
              {/*Sprawdza czy kolekcja poprawnie pobrała infomrację o filmach, nastepnie czy w kolekcji znajdują się jakieś filmy i
          wyświetla odpowiedni komunikat */}
              {movieCollection?.movies ? (
                movieCollection.movies.$values.length > 0 ? (
                  <div className="d-flex gap-3 align-items-stretch h-100 w-100">
                    {movieCollection.movies.$values.slice(0, 5).map((movie) => (
                      <Card
                        key={movie.movieId}
                        className="h-100 zoomCard"
                        style={{ width: "150px", cursor: "pointer" }}
                        title={movie.title}
                        onClick={() => navigate(`/${movie.movieId}`)}
                      >
                        <Card.Img
                          variant="top"
                          style={{ height: "80%", objectFit: "cover" }}
                          src={movie.posterUrl}
                        />
                        <Card.Body className="d-flex flex-column justify-content-between">
                          <Card.Text
                            className="text-center"
                            style={{
                              fontSize: "0.9rem",
                              maxHeight: "2.7rem", // 2 linijki * 1.35rem
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {movie.title}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-dark">Brak filmów do wyświetlenia</p>
                )
              ) : (
                <p className="text-dark">
                  Błąd podczas ładownia zawartości listy
                </p>
              )}
            </div>
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

            {reviews.length > 0 ? (
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
                    onDelete={() =>
                      onDeleteReview(review?.movieCollectionReviewId)
                    }
                    commentCount={getReplyCountForReview(
                      review.movieCollectionReviewId
                    )}
                    displayCommentCount
                  />
                ))
            ) : (
              <p>Brak recenzji dla tej kolekcji.</p>
            )}
          </div>
          <PaginationModule
            currentPage={pagination.pageNumber}
            totalPages={pagination.totalPages}
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
    </div>
  );
};

export default MovieCollectionReviewsPage;
