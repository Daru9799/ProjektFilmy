import axios from "axios";
import { MovieCollection } from "../models/MovieCollection";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import qs from "qs";
import { API_BASE_URL } from "../constants/api";
import { useApiQuery } from "../hooks/useApiQuery";

//to do: OBSLUGA BLEDOW
export const useMovieCollectionsByUser = (userId: string | undefined, page: number, pageSize: number, sortOrder: string, sortDirection: string) => {
  return useQuery<{ collections: MovieCollection[]; totalPages: number; }>({
    queryKey: ["movieCollectionsByUser", userId, page, pageSize, sortOrder, sortDirection],
    queryFn: async () => {
      if (!userId) return { collections: [], totalPages: 1 };
      const { data } = await axios.get(`${API_BASE_URL}/MovieCollection/by-user-id/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            pageNumber: page,
            pageSize,
            orderBy: sortOrder,
            sortDirection,
          },
          paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: "repeat" }),
        }
      );
      return {
        collections: data.data?.$values ?? [],
        totalPages: data.totalPages ?? 1,
      };
    },
    retry: false,
    placeholderData: keepPreviousData,
  });
};

//to do: OBSLUGA BLEDOW
export const useMovieCollectionById = (movieCollectionId: string | undefined) => {
  return useApiQuery<MovieCollection, string>({
    queryKey: ["movieCollection", movieCollectionId],
    queryFn: async () => {
      if (!movieCollectionId) throw "Brak movieCollectionId";
      const { data } = await axios.get(`${API_BASE_URL}/MovieCollection/${movieCollectionId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return data;
    },
    retry: false,
  });
};

//to do: OBSLUGA BLEDOW
export const useCreateMovieCollectionApi = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: async (payload: { title: string; description: string; shareMode: number; type: number; allowCopy: boolean; movieIds: string[]; }) => {
    const response = await axios.post(`${API_BASE_URL}/MovieCollection/add-collection`, {
        Title: payload.title,
        Description: payload.description,
        ShareMode: payload.shareMode,
        Type: payload.type,
        AllowCopy: payload.allowCopy,
        MovieIds: payload.movieIds,
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
      await queryClient.invalidateQueries({ queryKey: ["movieCollectionsByUser"] });
    },
  });
};