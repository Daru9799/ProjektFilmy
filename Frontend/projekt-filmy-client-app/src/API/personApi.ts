import axios from "axios";
import { Person } from "../models/Person";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "../constants/api";
import { Movie } from "../models/Movie";

//to do: OBSLUGA BLEDOW
export const usePersonById = (id: string | undefined) => {
  return useQuery<Person>({
    queryKey: ['person', id],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/People/${id}`);
      return data;
    },
  });
};

//to do: OBSLUGA BLEDOW
export const usePersonMovies = (personId: string | undefined) => {
  return useQuery<Movie[]>({
    queryKey: ['personMovies', personId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/Movies/by-personId/${personId}`);
      return data.$values ?? [];
    },
    retry: false,
  });
};

//to do: OBSLUGA BLEDOW
// Do pobrania wszystkich osób po określonej roli
export const usePeopleByRole = (page: number, pageSize: number, role: number, searchText: string = "") => {
  return useQuery<{ people: Person[]; totalPages: number }>({
    queryKey: ["peopleByRole", page, pageSize, role, searchText],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/People/by-filters`, {
        params: {
          pageNumber: page,
          pageSize: pageSize,
          role: role,
          personSearch: searchText,
        },
      });
      return {
        people: data.data?.$values ?? [],
        totalPages: data.totalPages ?? 1,
      };
    },
    retry: false,
  });
};

//to do: OBSLUGA BLEDOW
export const usePeopleByRoleNoPgnt = (role: number, searchText: string = "") => {
  return useQuery<Person[]>({
    queryKey: ["peopleByRoleNoPgnt", role, searchText],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/People/by-filters`, {
        params: {
          noPagination: true,
          role: role,
          personSearch: searchText,
        },
      });
      return data.data?.$values ?? [];
    },
    retry: false,
  });
};