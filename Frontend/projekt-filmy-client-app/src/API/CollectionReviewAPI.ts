import axios from "axios";

export const fetchCollectionReviewData = async (
  reviewId: string | undefined,
  setReview: React.Dispatch<React.SetStateAction<any>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    const response = await axios.get(
      `https://localhost:7053/api/MovieCollectionReviews/${reviewId}`
    );
    setReview(response.data);
    console.log(response.data);
  } catch (err) {
    setError("Failed to fetch collection review data");
    console.error(err);
  }
};

export const deleteReviewMC = async (
  reviewId: string | undefined,
  setReviews: React.Dispatch<React.SetStateAction<any[]>>
) => {
  try {
    await axios.delete(
      `https://localhost:7053/api/MovieCollectionReviews/delete-movie-collection-review/${reviewId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setReviews((prevReviews) =>
      prevReviews.filter((review) => review.reviewId !== reviewId)
    );
  } catch (err) {
    console.error("Błąd podczas usuwania recenzji:", err);
    alert("Nie udało się usunąć recenzji. Spróbuj ponownie.");
  }
};

export const editReviewMC = async (
  reviewId: string,
  updatedReview: { comment: string; rating: number },
  setReviews: React.Dispatch<React.SetStateAction<any[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    const response = await axios.put(
      `https://localhost:7053/api/MovieCollectionReviews/edit-movie-collection-review/${reviewId}`,
      updatedReview,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.status === 200) {
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.reviewId === reviewId
            ? { ...review, ...updatedReview }
            : review
        )
      );
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404) {
        setError("Nie udało się dodać modyfikacji");
      } else {
        setError("Wystąpił błąd podczas modyfikacji recenzji.");
      }
    }
    console.error(err);
  }
};
