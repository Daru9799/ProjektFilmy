import { useState, useEffect } from "react";
import axios from "axios";
import qs from "qs";
import { Movie } from "../models/Movie";

export const useMovieSearch = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [filterList, setFilterList] = useState<[string[], string[], string[], string[]]>([[], [], [], []]);
  const [sortCategory, setSortCategory] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageInfo, setPageInfo] = useState({
    totalItems: 0,
    pageNumber: 1,
    pageSize: 4,
    totalPages: 1,
  });

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = () => {
    setLoading(true);
    setError(null);

    axios
      .get("https://localhost:7053/api/Movies/by-filters", {
        params: {
          pageNumber: currentPage,
          pageSize: pageInfo.pageSize,
          titleSearch: searchText,
          orderBy: sortCategory,
          sortDirection: sortDirection,
          categoryNames: filterList[0],
          countryNames: filterList[1],
          actorsList: filterList[2],
          directorsList: filterList[3],
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      })
      .then((response) => {
        const { data, totalItems, pageNumber, pageSize, totalPages } = response.data;
        setMovies(data.$values);
        setPageInfo({ totalItems, pageNumber, pageSize, totalPages });
      })
      .catch((err) => {
        setError("Wystąpił błąd podczas pobierania filmów.");
        setMovies([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMovies();
  }, [currentPage, sortCategory, sortDirection]);

  return {
    searchText,
    setSearchText,
    filterList,
    setFilterList,
    sortCategory,
    setSortCategory,
    sortDirection,
    setSortDirection,
    movies,
    loading,
    error,
    fetchMovies,
    pageInfo,
    setCurrentPage,
  };
};
