import axios from "axios";
import { Achievement} from "../models/Achievement";
import { UserAchievement } from "../models/UserAchievement";
import { useQuery, keepPreviousData  } from "@tanstack/react-query";
import { API_BASE_URL } from "../constants/api";

//to do: OBSLUGA BLEDOW
export const useAchievements = (page: number, pageSize: number, sortOrder: string, sortDirection: string) => {
  return useQuery<{ achievements: Achievement[]; totalPages: number }>({
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

//to do: OBSLUGA BLEDOW
export const useUserAchievements = ( userName: string, page: number, pageSize: number, sortOrder: string, sortDirection: string) => {
  return useQuery<{ achievements: UserAchievement[]; totalPages: number }>({
    queryKey: ['userAchievements', userName, page, pageSize, sortOrder, sortDirection],
    queryFn: async () => {
      if (!userName) throw new Error("Brak identyfikatora użytkownika");
      const { data } = await axios.get(`${API_BASE_URL}/Achievement/by-user-name/${userName}`,
        {
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
        achievements: data.data.$values,
        totalPages: data.totalPages,
      };
    },
    retry: false,
    placeholderData: keepPreviousData
  });
};