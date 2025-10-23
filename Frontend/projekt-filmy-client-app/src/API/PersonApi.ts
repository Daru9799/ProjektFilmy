import axios from "axios";
import { Person } from "../models/Person";
import { keepPreviousData } from "@tanstack/react-query";
import { API_BASE_URL } from "../constants/api";
import { Movie } from "../models/Movie";
import { useApiQuery } from "../hooks/useApiQuery";

export const usePersonById = (id: string | undefined) => {
  return useApiQuery<Person>({
    queryKey: ['person', id],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/People/${id}`);
      return data;
    },
  });
};

export const usePersonMovies = (personId: string | undefined) => {
  return useApiQuery<Movie[]>({
    queryKey: ['personMovies', personId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/Movies/by-personId/${personId}`);
      return data.$values ?? [];
    },
    retry: false,
  });
};

// Do pobrania wszystkich osób po określonej roli
export const usePeopleByRole = (page: number, pageSize: number, role: number, searchText: string = "") => {
  return useApiQuery<{ people: Person[]; totalPages: number }>({
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
    placeholderData: keepPreviousData
  });
};

export const usePeopleByRoleNoPgnt = (role: number, searchText: string = "") => {
  return useApiQuery<Person[]>({
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