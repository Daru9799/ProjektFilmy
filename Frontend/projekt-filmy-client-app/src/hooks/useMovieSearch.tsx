import { useState } from "react";
import { useMovieLoader } from "./useMovieLoader";

const staticPageSize = 4;

export const useSearchMovies = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [filterList, setFilterList] = useState<[string[], string[], string[], string[]]>([[], [], [], []]);
  const [sortCategory, setSortCategory] = useState<string>("title");
  const [sortDirection, setSortDirection] = useState<string>("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, apiError, isNoMovieModalVisible, setIsNoMovieModalVisible } = useMovieLoader( currentPage, staticPageSize, searchText, sortCategory, sortDirection, filterList);

  const handleSearchSubmit = () => {
    setCurrentPage(1); 
  };

  const handleSort = (type: string) => {
    const [category, direction] = type.split(" ");
    setSortCategory(category);
    setSortDirection(direction);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    searchText,
    setSearchText,
    filterList,
    setFilterList,
    sortCategory,
    sortDirection,
    movies: data?.movies ?? [],
    pageInfo: { totalPages: data?.totalPages ?? 0 },
    currentPage,
    handlePageChange,
    handleSearchSubmit,
    handleSort,
    isNoMovieModalVisible,
    setIsNoMovieModalVisible,
    isLoading,
    apiError
  };
};
