import axios from "axios";
import { API_BASE_URL } from "../constants/api";
import { Review } from "../models/Review";
import { keepPreviousData, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserStats } from "../models/UserStats";
import { UserProfile } from "../models/UserProfile";
import { useApiQuery } from "../hooks/useApiQuery";

export const useUserReviews = (userName: string | undefined, page: number, pageSize: number, sortOrder: string = "desc", sortDirection: string = "year") => {
  return useApiQuery<{ reviews: Review[]; totalPages: number }>({
    queryKey: ["userReviews", userName, page, pageSize, sortOrder, sortDirection],
    queryFn: async () => {
      if (!userName) return { reviews: [], totalPages: 0 };

      try {
        const { data } = await axios.get(`${API_BASE_URL}/Reviews/by-username/${userName}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            pageNumber: page,
            pageSize,
            orderBy: sortOrder,
            sortDirection: sortDirection,
          },
        });

        return {
          reviews: data.data?.$values ?? [],
          totalPages: data.totalPages ?? 1,
        };
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          return { reviews: [], totalPages: 1 };
        }
        throw err;
      }
    },
    retry: false,
    placeholderData: keepPreviousData,
  });
};

export const useUserStatistics = (userName: string | undefined) => {
  return useApiQuery<UserStats | null>({
    queryKey: ["userStatistics", userName],
    queryFn: async () => {
      if (!userName) return null;

      const { data } = await axios.get<UserStats>(
        `${API_BASE_URL}/users/statistics/${userName}`,
        {
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

export const useUserData = (userName: string | undefined) => {
  return useApiQuery<UserProfile>({
    queryKey: ["userData", userName],
    queryFn: async () => {
      if (!userName) throw new Error("Brak nazwy użytkownika");
      const { data } = await axios.get<UserProfile>(`${API_BASE_URL}/Users/by-username/${userName}`, {
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

export const useChangeUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: string }) => {
      const token = localStorage.getItem("token");
      const response = await axios.patch(`${API_BASE_URL}/Users/change-role/${userId}`,
        { newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: async () => {
      //Odświeżenie danych usera i recenzji
      await queryClient.invalidateQueries({ queryKey: ["userData"]} );
      await queryClient.invalidateQueries({ queryKey: ["userReviews"] });
    },
  });
};

export const useAddFollowMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (movieId: string) => {
      const { data } = await axios.post(`${API_BASE_URL}/Users/add-follow-movie/${movieId}`,
        {}, //Do POST musi byc body wysylane (inaczej wywali 401 XD)
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["isFollowingMovie"] });
    },
  });
};

export const useRemoveFollowMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (movieId: string) => {
      if (!movieId) throw new Error("Brak ID filmu!");
      const { data } = await axios.delete(`${API_BASE_URL}/Users/delete-follow-movie/${movieId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["isFollowingMovie"] });
    },
  });
};

export const useIsFollowingMovie = (movieId: string | undefined) => {
  return useApiQuery<boolean>({
    queryKey: ["isFollowingMovie", movieId],
    queryFn: async () => {
      if (!movieId) throw new Error("Brak ID filmu!");
      const { data } = await axios.get<boolean>(`${API_BASE_URL}/Users/get-follow-movie/${movieId}`, {
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

export const useAddFollowPerson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (personId: string) => {
      if (!personId) throw new Error("Brak ID osoby!");
      const { data } = await axios.post(`${API_BASE_URL}/Users/add-follow-person/${personId}`,
        {}, //Do POST musi byc body wysylane (inaczej wywali 401 XD)
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["isFollowingPerson"] });
    },
  });
};

export const useRemoveFollowPerson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (personId: string) => {
      if (!personId) throw new Error("Brak ID osoby!");
      const { data } = await axios.delete(`${API_BASE_URL}/Users/delete-follow-person/${personId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["isFollowingPerson"] });
    },
  });
};

export const useIsFollowingPerson = (personId: string | undefined) => {
  return useApiQuery<boolean>({
    queryKey: ["isFollowingPerson", personId],
    queryFn: async () => {
      if (!personId) throw new Error("Brak ID osoby!");
      const { data } = await axios.get<boolean>(`${API_BASE_URL}/Users/get-follow-person/${personId}`, {
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