import axios from "axios";
import { Category } from "../models/Category";
import { API_BASE_URL } from "../constants/api"
import { useApiQuery } from "../hooks/useApiQuery";

export const useCategories = () => {
  return useApiQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/Categories/all`);
      const data = res.data?.$values ?? [];
      return data;
    },
  });
};