import { useState } from "react";
import axios from "axios";
import { Movie } from "../models/Movie";
import { fetchMoviesByFilters } from "../API/movieApi";

export const useMovieLoader = (defaultPageSize: number = 4) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pageInfo, setPageInfo] = useState({
    totalItems: 0,
    pageNumber: 1,
    pageSize: defaultPageSize,
    totalPages: 1,
  });
  const [isNoMovieModalVisible, setIsNoMovieModalVisible] = useState(false);

  const loadMovies = async ({
    page = 1,
    sortCategory = "title",
    sortDirection = "asc",
    searchText = "",
    filterList = [[], [], [], []],
    pageSize,
  }: {
    page?: number;
    sortCategory?: string;
    sortDirection?: string;
    searchText?: string;
    filterList?: [string[], string[], string[], string[]];
    pageSize?: number;
  }) => {
    const effectivePageSize = pageSize ?? defaultPageSize;

    try {
      const response = await fetchMoviesByFilters({
        pageNumber: page,
        pageSize: effectivePageSize,
        titleSearch: searchText,
        orderBy: sortCategory,
        sortDirection,
        categoryNames: filterList[0],
        countryNames: filterList[1],
        actorsList: filterList[2],
        directorsList: filterList[3],
      });

      const { data, totalItems, pageNumber, totalPages } = response;
      setPageInfo({ totalItems, pageNumber, pageSize: effectivePageSize, totalPages });
      setMovies(data.$values);

      if (data.$values.length === 0) {
        setIsNoMovieModalVisible(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setIsNoMovieModalVisible(true);
        setMovies([]);
        setPageInfo({
          totalItems: 0,
          pageNumber: 1,
          pageSize: effectivePageSize,
          totalPages: 1,
        });
      }
      console.error("Błąd podczas pobieraniu filmów:", error);
    }
  };

  return {
    movies,
    pageInfo,
    isNoMovieModalVisible,
    setIsNoMovieModalVisible,
    loadMovies,
  };
};
