import axios from "axios";
import { Recommendation } from "../models/Recommendation";

export const fetchRecommendByMovieId = async (
  movieId: string | undefined,
  currentPage: number,
  staticPageSize: number,
  setPagination: React.Dispatch<
    React.SetStateAction<{
      totalItems: number;
      pageNumber: number;
      pageSize: number;
      totalPages: number;
    }>
  >,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
): Promise<Recommendation[]> => {
  if (!movieId) {
    throw new Error("Movie ID is required");
  }

  try {
    const response = await axios.get(
      `https://localhost:7053/api/Recommendations/by-movieId/${movieId}`,
      {
        params: {
          pageNumber: currentPage,
          pageSize: staticPageSize,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.data) {
      const { data,pageNumber,totalItems, pageSize, totalPages } =
        response.data;
      setPagination({
        totalItems,
        pageNumber,
        pageSize,
        totalPages,
      });
    }
    return response.data.data.$values;
    
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorMessage = err.response
        ? `Server error: ${err.response.status} - ${err.response.statusText}`
        : "Network error: Could not connect to server";
      throw new Error(errorMessage);
    }
    throw new Error("Unexpected error occurred");
  }
};

export const CreateRecommendation = async (
  movieId: string | undefined,
  recommendMovieId: string | undefined
) => {
  try {
    if (!movieId || !recommendMovieId) {
      throw new Error("Both movie IDs are required");
    }

    const response = await axios.post(
      `https://localhost:7053/api/Recommendations/${movieId}/add-recommend-with-like/${recommendMovieId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      // Błędy specyficzne z backendu
      if (err.response) {
        // Błędy walidacji (400)
        if (err.response.status === 400) {
          throw new Error(err.response.data || "Validation error occurred");
        }
        // Konflikty (409)
        if (err.response.status === 409) {
          throw new Error(err.response.data?.Error || "Conflict occurred");
        }
        // Inne błędy serwera
        if (err.response.status >= 500) {
          throw new Error(
            err.response.data?.message || "Server error occurred"
          );
        }
      }
      // Błąd połączenia
      throw new Error("Network error: Could not connect to server");
    }
    // Inne błędy (np. z walidacji przed wysłaniem)
    throw err instanceof Error ? err : new Error("Unknown error occurred");
  }
};

export const LikeRecommendation = async (recommendId: string) => {
  try {
    const response = await axios.post(
      `https://localhost:7053/api/Recommendations/like-recommend/${recommendId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data; // Dobrą praktyką jest zwracanie odpowiedzi
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorMessage = err.response
        ? `Server error: ${err.response.status} - ${err.response.data?.message || err.response.statusText}`
        : "Network error: Could not connect to server";
      throw new Error(errorMessage);
    }
    throw new Error("Unexpected error occurred");
  }
};

export const DeleteLikeRecommendation = async (recommendId: string) => {
  try {
    const response = await axios.delete(
      `https://localhost:7053/api/Recommendations/delete-like-recommend/${recommendId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorMessage = err.response
        ? `Server error: ${err.response.status} - ${err.response.data?.message || err.response.statusText}`
        : "Network error: Could not connect to server";
      throw new Error(errorMessage);
    }
    throw new Error("Unexpected error occurred");
  }
};