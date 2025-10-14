import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  addToPlanned,
  addToWatched,
  checkIfInPlanned,
  checkIfInWatched,
  deleteFromPlanned,
  deleteFromWatched,
} from "../API/movieApi";
import { getLoggedUserId } from "./decodeJWT";

export const useMoviePageLogic = () => {
  const { movieId } = useParams();
  const userName = localStorage.getItem("logged_username") || "";

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [inList, setInList] = useState<string | null>(null);

  useEffect(() => {
    if (movieId && userName) {
      const fetchData = async () => {
        const loggedUserId = getLoggedUserId();
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

  const handleLoginSuccess = async (username: string) => {
    setShowLoginModal(false);
    localStorage.setItem("logged_username", username);
    window.dispatchEvent(
      new CustomEvent("userUpdated", { detail: { username } })
    );

    if (movieId) {
      try {
        await Promise.all([
          checkIfInPlanned(movieId, setInList, setError),
          checkIfInWatched(movieId, setInList, setError),
        ]);
        // await fetchUserReviewForMovie(
        //   username,
        //   movieId,
        //   setUserReview,
        //   setError
        // );
      } catch (err) {
        console.error("Błąd podczas odświeżania danych po zalogowaniu:", err);
      }
    }
  };

  // sprawdzanie czy użytkownik followuje

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
    showReviewModal,
    showLoginModal,
    loading,
    error,
    isLoggedIn: !!localStorage.getItem("token"),
    inList,
    setShowReviewModal,
    setShowLoginModal,
    handleLoginSuccess,
    setInList,
    handleChangePlanned,
    handleChangeWatched,
  };
};