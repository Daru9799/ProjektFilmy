import axios from "axios";
import { Movie } from "../models/Movie";
import { Person } from "../models/Person";
import { keepPreviousData, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "../constants/api";
import qs from "qs";
import { useApiQuery } from "../hooks/useApiQuery";

export const useMovieById = (id: string | undefined) => {
  return useApiQuery<Movie>({
    queryKey: ["movie", id],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/Movies/${id}`);
      return data;
    },
    retry: false,
  });
};

export const useActorsByMovieId = (movieId: string | undefined) => {
  return useApiQuery<Person[]>({
    queryKey: ["actors", movieId],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/People/by-filters`, {
          params: {
            pageNumber: 1,
            pageSize: 2,
            noPagination: true,
            role: 1,
            movieId: movieId,
          },
        });

        const actorsArray = response.data?.data?.$values;
        if (Array.isArray(actorsArray)) {
          return actorsArray;
        } else {
          return [];
        }
      } catch (err: any) {
        //404 jako pusta lista
        if (err.response?.status === 404) {
          return [];
        }
        throw err;
      }
    },
    retry: false,
  });
};

export const useMoviesByFilters = (page: number, pageSize: number, titleSearch?: string, orderBy?: string, sortDirection?: string, categoryNames?: string[], countryNames?: string[], actorsList?: string[], directorsList?: string[]) => {
  return useApiQuery<{ movies: Movie[]; totalPages: number }>({
    queryKey: ["movies", page, pageSize, titleSearch, orderBy, sortDirection, categoryNames, countryNames, actorsList, directorsList],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/Movies/by-filters`, {
          params: {
            pageNumber: page,
            pageSize,
            titleSearch,
            orderBy,
            sortDirection,
            categoryNames,
            countryNames,
            actorsList,
            directorsList,
          },
            paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: "repeat" }),
        });

        return {
          movies: data.data?.$values ?? [],
          totalPages: data.totalPages ?? 1,
        };
      } catch (err: any) {
        if (err.response?.status === 404) {
          return { movies: [], totalPages: 1 };
        }
        throw err;
      }
    },
    retry: false,
    placeholderData: keepPreviousData
  });
};

export const useMoviesByCollectionId = (movieCollectionId: string | null, page: number, pageSize: number) => {
  return useApiQuery<{ movies: Movie[]; totalPages: number }>({
    queryKey: ["moviesByCollection", movieCollectionId, page, pageSize],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/Movies/by-collectionId/${movieCollectionId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            pageNumber: page,
            pageSize,
          },
          paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: "repeat" }),
        });

        return {
          movies: data?.$values ?? [],
          totalPages: data.totalPages ?? 1,
        };
      } catch (err: any) {
        if (err.response?.status === 404) {
          return { movies: [], totalPages: 1 };
        }
        throw err;
      }
    },
    retry: false,
    placeholderData: keepPreviousData
  });
};

export const useCheckIfInPlanned = (movieId: string | undefined) => {
  return useApiQuery<boolean>({
    queryKey: ["planned", movieId],
    queryFn: async () => {
      if (!movieId) return false;
      const token = localStorage.getItem("token");
      if (!token) return false;
      const res = await axios.get<boolean>(`${API_BASE_URL}/Movies/check-if-in-list/Planned/${movieId}`, { 
          headers: { 
            Authorization: `Bearer ${token}` 
          } 
        }
      );
      return res.data === true;
    }
  });
};

export const useCheckIfInWatched = (movieId: string | undefined) => {
  return useApiQuery<boolean>({
    queryKey: ["watched", movieId],
    queryFn: async () => {
      if (!movieId) return false;
      const token = localStorage.getItem("token");
      if (!token) return false;
      const res = await axios.get<boolean>(`${API_BASE_URL}/Movies/check-if-in-list/Watched/${movieId}`, { 
          headers: { 
            Authorization: `Bearer ${token}` 
          } 
        }
      );
      return res.data === true;
    }
  });
};

export const useAddToPlanned = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: async (movieId: string) => {
      await axios.post(`${API_BASE_URL}/Movies/planned/add-movie`, 
        { 
          movieId 
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planned"] });
      queryClient.invalidateQueries({ queryKey: ["watched"] });
    },
  });
};

export const useDeleteFromPlanned = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (movieId: string) => {
      await axios.delete(`${API_BASE_URL}/Movies/planned/delete-from-planned/${movieId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planned"] });
      queryClient.invalidateQueries({ queryKey: ["watched"] });
    },
  });
};

export const useAddToWatched = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (movieId: string) => {
      await axios.post(`${API_BASE_URL}/Movies/watched/add-movie`,
        { 
          movieId 
        },
        { 
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}` 
          } 
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watched"] });
      queryClient.invalidateQueries({ queryKey: ["planned"] });
    }
  });
};

export const useDeleteFromWatched = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (movieId: string) => {
      await axios.delete(`${API_BASE_URL}/Movies/watched/delete-from-watched/${movieId}`, { 
          headers: 
          { 
            Authorization: `Bearer ${localStorage.getItem("token")}` 
          } 
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watched"] });
      queryClient.invalidateQueries({ queryKey: ["planned"] });
    }
  });
};