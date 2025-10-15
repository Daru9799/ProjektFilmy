import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "../constants/api";
import { MovieCollectionReview } from "../models/MovieCollectionReview";

//to do: OBSLUGA BLEDOW
export const useCollectionReviewById = (reviewId: string | undefined) => {
  return useQuery({
    queryKey: ["collectionReview", reviewId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/MovieCollectionReviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return data;
    },
    retry: false,
    placeholderData: keepPreviousData,
  });
};

//to do: OBSLUGA BLEDOW
export const useCollectionReviewsByCollectionId = (movieCollectionId: string | undefined, page: number, pageSize: number, sortOrder: string, sortDirection: string) => {
  return useQuery<{ reviews: MovieCollectionReview[]; totalPages: number }>({
    queryKey: ["collectionReviews", movieCollectionId, page, pageSize, sortOrder, sortDirection],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/MovieCollectionReviews/by-movie-collection-id/${movieCollectionId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
              pageNumber: page,
              pageSize,
              orderBy: sortOrder,
              sortDirection,
            },
          }
        );
        return {
          reviews: data.data.$values,
          totalPages: data.totalPages,
        };
      } catch (error) {
        //Brak recenzji nie traktuje jako błąd
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return { reviews: [], totalPages: 1 };
        }
        throw error;
      }
    },
    retry: false,
    placeholderData: keepPreviousData,
  });
};

//to do: OBSLUGA BLEDOW
export const useUserReviewForCollection = (userId?: string | null, collectionId?: string) => {
  return useQuery<MovieCollectionReview | null>({
    queryKey: ["userCollectionReview", userId, collectionId],
    queryFn: async () => {
      try {
        if (!userId || !collectionId) return null;
        const token = localStorage.getItem("token");
        if (!token) {
          return null;
        }
        const { data } = await axios.get(`${API_BASE_URL}/MovieCollectionReviews/by-userid-and-moviecollection-id`, {
            params: { userId, movieCollectionId: collectionId },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return data ?? null;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
  });
};

//to do: OBSLUGA BLEDOW
export const useAddCollectionReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviewData: any) => {
      if (!reviewData.movieCollectionId) {
        throw new Error("Brak movieCollectionId");
      }
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Brak tokenu");
      }
      const { data } = await axios.post(`${API_BASE_URL}/MovieCollectionReviews/add-movie-collection-review`, {
          Rating: reviewData.rating,
          Comment: reviewData.comment,
          Date: new Date().toISOString(),
          MovieCollectionId: reviewData.movieCollectionId,
          UserName: reviewData.userName,
          Spoilers: reviewData.spoilers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    },
    onSuccess: async () => {
      //Odświezenie cache
      await queryClient.invalidateQueries({ queryKey: ["userCollectionReview"] });
      await queryClient.invalidateQueries({ queryKey: ["collectionReviews"] });
    },
  });
};

//to do: OBSLUGA BLEDOW
export const useDeleteCollectionReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviewId: string | undefined) => {
      await axios.delete(`${API_BASE_URL}/MovieCollectionReviews/delete-movie-collection-review/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return reviewId;
    },
    onSuccess: async () => {
      //Odświezenie cache
      await queryClient.invalidateQueries({ queryKey: ["collectionReviews"] });
      await queryClient.invalidateQueries({ queryKey: ["userCollectionReview"] });
    },
  });
};

//to do: OBSLUGA BLEDOW
export const useEditCollectionReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, updatedReview,}: { reviewId: string; updatedReview: { comment: string; rating: number }; }) => {
      const response = await axios.put(`${API_BASE_URL}/MovieCollectionReviews/edit-movie-collection-review/${reviewId}`,
        updatedReview,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: async () => {
      //Odświezenie cache
      await queryClient.invalidateQueries({ queryKey: ["collectionReviews"] });
      await queryClient.invalidateQueries({ queryKey: ["userCollectionReview"] });
    },
  });
};