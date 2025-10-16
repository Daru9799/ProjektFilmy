import { useState } from "react";

export const useMoviePageLogic = () => {
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const handleLoginSuccess = async (username: string) => {
    setShowLoginModal(false);
    localStorage.setItem("logged_username", username);
    window.dispatchEvent(
      new CustomEvent("userUpdated", { detail: { username } })
    );
  };

  return {
    showReviewModal,
    showLoginModal,
    isLoggedIn: !!localStorage.getItem("token"),
    setShowReviewModal,
    setShowLoginModal,
    handleLoginSuccess,
  };
};