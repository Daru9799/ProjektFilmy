import axios from "axios";
import { Achievement} from "../models/Achievement";
import { UserAchievement } from "../models/UserAchievement";
import { keepPreviousData  } from "@tanstack/react-query";
import { API_BASE_URL } from "../constants/api";
import { useApiQuery } from "../hooks/useApiQuery";

export const useAchievements = (page: number, pageSize: number, sortOrder: string, sortDirection: string) => {
  return useApiQuery<{ achievements: Achievement[]; totalPages: number }>({
    queryKey: ['achievements', page, pageSize, sortOrder, sortDirection],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/Achievement/all`,
        {
          params: { pageNumber: page, pageSize, orderBy: sortOrder, sortDirection }
        }
      );
      return {
        achievements: data.data.$values,
        totalPages: data.totalPages
      };
    },
    placeholderData: keepPreviousData
  });
};

export const useUserAchievements = ( userName: string, page: number, pageSize: number, sortOrder: string, sortDirection: string) => {
  return useApiQuery<{ achievements: UserAchievement[]; totalPages: number }>({
    queryKey: ['userAchievements', userName, page, pageSize, sortOrder, sortDirection],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/Achievement/by-user-name/${userName}`, {
            //withCredentials: true, //nowe credentiale zastepujace autoryzacje tokenem z localStorage
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
          achievements: data.data?.$values ?? [],
          totalPages: data.totalPages ?? 1,
        };
      } catch (err: any) {
        //Pusta lista przy 404
        if (err.response?.status === 404) {
          return { achievements: [], totalPages: 1 };
        }
        throw err;
      }
    },
    retry: false,
    placeholderData: keepPreviousData,
  });
};