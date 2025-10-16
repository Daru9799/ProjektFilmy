import { useEffect, useState } from "react";
import { useMoviesByFilters } from "../API/MovieApi";

export const useMovieLoader = (
  page: number,
  pageSize: number,
  titleSearch = "",
  orderBy = "title",
  sortDirection: string,
  filterList: [string[], string[], string[], string[]] = [[], [], [], []]
) => {
  const [isNoMovieModalVisible, setIsNoMovieModalVisible] = useState(false);

  const query = useMoviesByFilters(page, pageSize, titleSearch, orderBy, sortDirection, filterList[0], filterList[1], filterList[2], filterList[3]);

  useEffect(() => {
    if (query.data?.movies.length === 0) {
      setIsNoMovieModalVisible(true);
    }
  }, [query.data]);

  return {
    ...query, // { data, isLoading, error } -> zwraca po prostu react query
    isNoMovieModalVisible,
    setIsNoMovieModalVisible,
  };
};