import axios from "axios";
import { Review } from "../models/Review";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "../constants/api";

//to do: OBSLUGA BLEDOW
export const useReviewsByMovieId = (movieId: string | undefined, page: number, pageSize: number, sortOrder: string, sortDirection: string) => {
  return useQuery<{ reviews: Review[]; totalPages: number }>({
    queryKey: ["reviews", movieId, page, pageSize, sortOrder, sortDirection],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/Reviews/by-movie-id/${movieId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            pageNumber: page,
            pageSize,
            orderBy: sortOrder,
            sortDirection,
          },
        });

        return {
          reviews: data.data.$values,
          totalPages: data.totalPages,
        };
      } catch (error) {
        //Brak recenzji, to nie jest błąd
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
export const useUserReviewForMovie = (userName?: string, movieId?: string) => {
  return useQuery<Review | null>({
    queryKey: ["userReview", userName, movieId],
    queryFn: async () => {
      try {
        if (!userName || !movieId) return null;
        const token = localStorage.getItem("token");
        if (!token) return null;

        const { data } = await axios.get(`${API_BASE_URL}/Reviews/by-username-and-movie-id`, {
          params: { userName, movieId },
          headers: { Authorization: `Bearer ${token}` },
        });

        return data ?? null;
      } catch (error) {
        //Użytkownik nie ma recenzji dla tego filmu
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
export const useReviewById = (reviewId: string | undefined) => {
  return useQuery<Review>({
    queryKey: ["review", reviewId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/Reviews/${reviewId}`, {
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
export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviewId: string) => {
      await axios.delete(`${API_BASE_URL}/Reviews/delete-review/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return reviewId;
    },
    onSuccess: async () => {
      //Odświeżenie wszystkich cache, w których może być recenzja
      await queryClient.invalidateQueries({queryKey: ['review']})
      await queryClient.invalidateQueries({queryKey: ['reviews']})
      await queryClient.invalidateQueries({queryKey: ['userReview']})
      await queryClient.invalidateQueries({queryKey: ['userReviews']})
      await queryClient.invalidateQueries({queryKey: ['userData']})
    },
  });
};

//to do: OBSLUGA BLEDOW
export const useEditReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, updatedReview }: { reviewId: string; updatedReview: { comment: string; rating: number }; }) => {
      const response = await axios.put(`${API_BASE_URL}/Reviews/edit-review/${reviewId}`,
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
      //Odświeżenie wszystkich cache, w których może być recenzja
      await queryClient.invalidateQueries({queryKey: ['review']})
      await queryClient.invalidateQueries({ queryKey: ["reviews"] });
      await queryClient.invalidateQueries({ queryKey: ["userReview"] });
      await queryClient.invalidateQueries({ queryKey: ["userReviews"] });
    },
  });
};

//to do: OBSLUGA BLEDOW
export const useAddReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      reviewData: { rating: number; comment: string; movieId: string; userName: string; }) => {
        const response = await axios.post(`${API_BASE_URL}/Reviews/add-review`, {
            Rating: reviewData.rating,
            Comment: reviewData.comment,
            Date: new Date().toISOString(),
            MovieId: reviewData.movieId,
            UserName: reviewData.userName,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['review']})
      await queryClient.invalidateQueries({ queryKey: ["reviews"] });
      await queryClient.invalidateQueries({ queryKey: ["userReview"] });
      await queryClient.invalidateQueries({ queryKey: ["userReviews"] });
    },
  });
};