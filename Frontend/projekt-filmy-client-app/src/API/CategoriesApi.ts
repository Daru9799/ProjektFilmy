import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Category } from "../models/Category";
import { API_BASE_URL } from "../constants/api"

//to do: OBSLUGA BLEDOW
export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/Categories/all`);
      const data = res.data?.$values ?? [];
      return data;
    },
  });
};