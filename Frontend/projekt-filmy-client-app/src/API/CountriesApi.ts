import axios from "axios";
import { Country } from "../models/Country";
import { API_BASE_URL } from "../constants/api";
import { useApiQuery } from "../hooks/useApiQuery";

export const useCountries = () => {
  return useApiQuery<Country[]>({
    queryKey: ["countries"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/Countries/all`);
      const data = res.data?.$values ?? [];
      return data;
    },
  });
};