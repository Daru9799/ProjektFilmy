import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Review } from "../models/Review";
import {
  addToPlanned,
  addToWatched,
  checkIfInPlanned,
  checkIfInWatched,
  deleteFromPlanned,
  deleteFromWatched,
  fetchMovieReviews,
} from "../API/movieApi";
import { fetchUserReviewForMovie } from "../API/movieApi";
import { editReview, deleteReview } from "../API/reviewApi";
import { getLoggedUserId } from "./decodeJWT";
import { addFollowMovie, removeFollowMovie } from "../API/userAPI";

export const useMoviePageLogic = () => {
  const { movieId } = useParams();
  const userName = localStorage.getItem("logged_username") || "";

  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [inList, setInList] = useState<string | null>(null);

  useEffect(() => {
    if (movieId) {
      fetchMovieReviews(movieId, setReviews, setError, setLoading);
      fetchUserReviewForMovie(userName, movieId, setUserReview, setError);
    } else {
      setError("Nieoczekiwany błąd");
    }
  }, [movieId]);

  const checkFollowing = async (movieId: string) => {
    try {
      const response = await axios.get(
        `https://localhost:7053/api/Users/get-follow-movie/${movieId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data === true) {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    } catch (err) {
      console.error("Błąd po stronie sieci/axios:", err);
    }
  };

  useEffect(() => {
    if (movieId && userName) {
      const fetchData = async () => {
        const loggedUserId = getLoggedUserId();
        checkFollowing(movieId);
        console.log("jajko");
        try {
          await Promise.all([
            checkIfInPlanned(movieId, setInList, setError),
            checkIfInWatched(movieId, setInList, setError),
          ]);
        } catch (error) {
          console.log("Nie udało się pobrac informacji o zawartości list.");
        }

        if (!loggedUserId) {
          console.error("Brak zalogowanego użytkownika lub token niepoprawny.");
          return;
        }
      };

      fetchData();
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
        checkFollowing(movieId);
        await Promise.all([
          checkIfInPlanned(movieId, setInList, setError),
          checkIfInWatched(movieId, setInList, setError),
        ]);
        await fetchMovieReviews(movieId, setReviews, setError, setLoading);
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

  const handleChangeFollowing = async () => {
    if (isFollowing === false) {
      try {
        const data = await addFollowMovie(movieId);
        console.log("Odpowiedz: ", data);
        setIsFollowing(true);
      } catch (error: any) {
        console.error(error);
        setError(error);
      }
    } else {
      try {
        const data = await removeFollowMovie(movieId);
        console.log("Odpowiedz: ", data);
        setIsFollowing(false);
      } catch (error: any) {
        console.error(error);
        setError(error);
      }
    }
  };

  const handleChangePlanned = async () => {
    if (inList === "Planowany") {
      try {
        const data = await deleteFromPlanned(movieId, setError);
        console.log("Odpowiedz: " + data);
        setInList(null);
      } catch (error: any) {
        console.error(error);
      }
    } else {
      try {
        const data = await addToPlanned(movieId, setError);
        console.log("Odpowiedz: " + data);
        setInList("Planowany");
      } catch (error: any) {
        console.error(error);
      }
    }

    // await Promise.all([
    //   checkIfInPlanned(movieId, setInList, setError),
    //   checkIfInWatched(movieId, setInList, setError),
    // ]);
  };

  const handleChangeWatched = async () => {
    if (inList === "Obejrzany") {
      try {
        const data = await deleteFromWatched(movieId, setError);
        console.log("Odpowiedz: " + data);
        setInList(null);
      } catch (error: any) {
        console.error(error);
      }
    } else {
      try {
        const data = await addToWatched(movieId, setError);
        console.log("Odpowiedz: " + data);
        setInList("Obejrzany");
      } catch (error: any) {
        console.error(error);
      }
    }

    // await Promise.all([
    //   checkIfInPlanned(movieId, setInList, setError),
    //   checkIfInWatched(movieId, setInList, setError),
    // ]);
  };

  return {
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
    inList,
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
    setInList,
    handleChangePlanned,
    handleChangeWatched,
  };
};