import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "../constants/api";
import qs from "qs";

//to do: OBSLUGA BLEDOW
export const useRecommendationsByMovie = (movieId: string | undefined, currentPage: number, pageSize: number) => {
  return useQuery({ queryKey: ["recommendations", movieId, currentPage],
    queryFn: async () => {
      if (!movieId) return { recommendations: [], movies: [], pagination: null };
      //Pobranie rekomendacji
      const res = await axios.get(`${API_BASE_URL}/Recommendations/by-movieId/${movieId}`, {
        params: { pageNumber: currentPage, pageSize },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const { data, totalItems, pageNumber, totalPages, pageSize: pageSz } = res.data;
      const pagination = { totalItems, pageNumber, totalPages, pageSize: pageSz };
      const recommendations = data?.$values || [];
      const movieIds = recommendations.map((r: any) => r.recommendedMovieId);

      //Pobranie szczegółów o filmach z rekomendacji
      let movies = [];
      if (movieIds.length > 0) {
        const movieRes = await axios.get(`${API_BASE_URL}/Movies/get-list-by-id`, {
          params: { movieIdList: movieIds },
          paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        movies = movieRes.data?.$values || [];
      }
      return { recommendations, movies, pagination };
    },
    placeholderData: keepPreviousData
  });
};

//to do: OBSLUGA BLEDOW
export const useLikeRecommendation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (recommendId: string) => {
      const res = await axios.post(`${API_BASE_URL}/Recommendations/like-recommend/${recommendId}`, 
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: async () => {
      //Odświeżenie listy rekomendacji po usunięciu polubienia
      await queryClient.invalidateQueries({ queryKey: ["recommendations"] });
    },
  });
};

//to do: OBSLUGA BLEDOW
export const useDeleteLikeRecommendation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (recommendId: string) => {
      const res = await axios.delete(`${API_BASE_URL}/Recommendations/delete-like-recommend/${recommendId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: async () => {
      //Odświeżenie listy rekomendacji po usunięciu polubienia
      await queryClient.invalidateQueries({ queryKey: ["recommendations"] });
    },
  });
};

//to do: OBSLUGA BLEDOW
export const useCreateRecommendation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ movieId, recommendMovieId }: { movieId: string; recommendMovieId: string }) => {
      const response = await axios.post(`${API_BASE_URL}/Recommendations/${movieId}/add-recommend-with-like/${recommendMovieId}`,
        null,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["recommendations"] });
    }
  });
};