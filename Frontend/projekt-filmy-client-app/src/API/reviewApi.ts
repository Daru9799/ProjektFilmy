import axios from "axios";
import { Review } from "../models/Review";


// Delete user review
export const deleteReview = async (
  reviewId: string,
  setReviews: React.Dispatch<React.SetStateAction<any[]>>
) => {
  try {
    await axios.delete(
      `https://localhost:7053/api/Reviews/delete-review/${reviewId}`,
      {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    });
    setReviews((prevReviews) => prevReviews.filter((review) => review.reviewId !== reviewId));
  } catch (err) {
    console.error("Błąd podczas usuwania recenzji:", err);
    alert("Nie udało się usunąć recenzji. Spróbuj ponownie.");
  }
};

export const editReview = async (
  reviewId: string,
  updatedReview: { comment: string; rating: number },
  setReviews: React.Dispatch<React.SetStateAction<any[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    const response = await axios.put(
      `https://localhost:7053/api/Reviews/edit-review/${reviewId}`,
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
          review.reviewId === reviewId ? { ...review, ...updatedReview } : review
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

export const fetchReviewsByMovieId = async (
  movieId: string | undefined,
  page: number,
  pageS: number,
  sortOrder: string,
  sortDirection: string,
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>,
  setPagination: React.Dispatch<
    React.SetStateAction<{
      totalItems: number;
      pageNumber: number;
      pageSize: number;
      totalPages: number;
    }>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  try {
    const reviewResponse = await axios.get(
      `https://localhost:7053/api/Reviews/by-movie-id/${movieId}`,
      {
        params: {
          pageNumber: page,
          pageSize: pageS,
          orderBy: sortOrder,
          sortDirection: sortDirection,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,  // Dodanie nagłówka z tokenem
        },
      }
    );
    const { data, totalItems, pageNumber, pageSize, totalPages } = reviewResponse.data;
    setReviews(data.$values);
    setPagination({ totalItems, pageNumber, pageSize, totalPages });
  }
  catch (err) {
    if (axios.isAxiosError(err)) {
      setError(err.response ? `${err.response.status} - ${err.response.statusText}` : "Błąd sieci.");
    } else {
      setError("Nieoczekiwany błąd.");
    }
  }
};