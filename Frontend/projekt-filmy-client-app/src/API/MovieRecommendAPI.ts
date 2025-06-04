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