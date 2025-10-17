import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Country } from "../models/Country";
import { API_BASE_URL } from "../constants/api";

//to do: OBSLUGA BLEDOW
export const useCountries = () => {
  return useQuery<Country[]>({
    queryKey: ["countries"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/Countries/all`);
      const data = res.data?.$values ?? [];
      return data;
    },
  });
};