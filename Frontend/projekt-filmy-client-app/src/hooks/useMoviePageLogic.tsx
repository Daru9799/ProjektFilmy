import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Movie } from "../models/Movie";
import { Person } from "../models/Person";
import { Review } from "../models/Review";
import {
  fetchActorsData,
  fetchMovieData,
  fetchMovieReviews,
} from "../API/movieApi";
import { fetchUserReviewForMovie } from "../API/movieApi";
import { editReview, deleteReview } from "../API/reviewApi";
import { decodeJWT } from "./decodeJWT";
import { addFollowMovie, removeFollowMovie } from "../API/userAPI";

export const useMoviePageLogic = () => {
  const { movieId } = useParams();
  const userName = localStorage.getItem("logged_username") || "";

  const [movie, setMovie] = useState<Movie | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    if (movieId) {
      fetchMovieData(movieId, setMovie, setError);
      fetchActorsData(movieId, setPeople, setError);
      fetchMovieReviews(movieId, setReviews, setError, setLoading);
      fetchUserReviewForMovie(userName, movieId, setUserReview, setError);
      checkFollowing();
    } else {
      setError("Nieoczekiwany błąd");
    }
  }, [movieId]);

  const handleEditReview = (review: Review) => {
    setReviewToEdit(review);
    setShowEditModal(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId, setReviews);
      setUserReview(null);
      if (movieId) {
        await fetchMovieReviews(movieId, setReviews, setError, setLoading);
        await fetchMovieData(movieId, setMovie, setError);
      }
    } catch (err) {
      console.error("Błąd podczas usuwania recenzji:", err);
    }
  };

  const handleSaveEditedReview = async (reviewText: string, rating: number) => {
    if (reviewToEdit) {
      try {
        await editReview(
          reviewToEdit.reviewId,
          { comment: reviewText, rating },
          setReviews,
          setError
        );
        if (movieId) {
          await fetchMovieReviews(movieId, setReviews, setError, setLoading);
          await fetchMovieData(movieId, setMovie, setError);
          await fetchUserReviewForMovie(
            userName,
            movieId,
            setUserReview,
            setError
          );
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

  const handleLoginSuccess = async (username: string) => {
    setShowLoginModal(false);
    localStorage.setItem("logged_username", username);
    window.dispatchEvent(
      new CustomEvent("userUpdated", { detail: { username } })
    );

    if (movieId) {
      try {
        await fetchMovieReviews(movieId, setReviews, setError, setLoading);
        await fetchMovieData(movieId, setMovie, setError);
        await fetchUserReviewForMovie(
          username,
          movieId,
          setUserReview,
          setError
        );
      } catch (err) {
        console.error("Błąd podczas odświeżania danych po zalogowaniu:", err);
      }
    }
  };

  const handleAddReview = async (review: string, rating: number) => {
    try {
      const response = await axios.post(
        "https://localhost:7053/api/Reviews/add-review",
        {
          Rating: rating,
          Comment: review,
          Date: new Date().toISOString(),
          MovieId: movieId,
          UserName: userName,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200 && movieId) {
        await fetchMovieReviews(movieId, setReviews, setError, setLoading);
        await fetchMovieData(movieId, setMovie, setError);
        await fetchUserReviewForMovie(
          userName,
          movieId,
          setUserReview,
          setError
        );
        setShowReviewModal(false);
      }
    } catch (error) {
      console.error("Błąd podczas dodawania recenzji:", error);
      setError("Błąd podczas dodawania recenzji");
    }
  };

  // sprawdzanie czy użytkownik followuje

  const checkFollowing = () => {
    if (movieId && userName) {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token nie jest dostępny.");
        return;
      }
      const decodedToken = decodeJWT(token);
      const loggedUserId = decodedToken.nameid;

      if (movie?.followers?.$values.some((user) => user.id === loggedUserId)) {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    }
  };

  const handleChangeFollowing = async () => {
    if (isFollowing === false) {
      try {
        const data = await addFollowMovie(movie?.movieId);
        console.log("Odpowiedz: ", data);
        setIsFollowing(true);
      } catch (error: any) {
        console.error(error);
        setError(error);
      }
    } else {
      try {
        const data = await removeFollowMovie(movie?.movieId);
        console.log("Odpowiedz: ", data);
        setIsFollowing(false);
      } catch (error: any) {
        console.error(error);
        setError(error);
      }
    }
  };

  return {
    movie,
    people,
    reviews,
    userReview,
    reviewToEdit,
    showEditModal,
    showReviewModal,
    showLoginModal,
    loading,
    error,
    isLoggedIn: !!localStorage.getItem("token"),
    isFollowing,
    setShowReviewModal,
    setShowLoginModal,
    setShowEditModal,
    setIsFollowing,
    handleEditReview,
    handleDeleteReview,
    handleAddReview,
    handleLoginSuccess,
    handleSaveEditedReview,
    handleChangeFollowing,
  };
};
