import React, { ReactNode, useEffect, useState } from "react";
import qs from "qs";
import axios from "axios";

import SearchModule from "../SearchModule";
import FilterMovieModule from "./FilterMovieModule";
import PaginationModule from "../PaginationModule";
import SortMovieModule from "./SortMovieModule";
import { Movie } from "../../models/Movie";
import MovieListModule from "./MovieListModule";
import NoMoviesModal from "./NoMoviesModal";
import { fetchMoviesByFilters } from "../../API/movieApi";

const SearchMoviesPage = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [filterList, setFilterList] = useState<[string[], string[], string[], string[]]>([[], [], [], []]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pageInfo, setPageInfo] = useState({
    totalItems: 0,
    pageNumber: 1,
    pageSize: 2,
    totalPages: 1,
  });
  const [sortCategory, setSortCategory] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isNoMovieModalVisible, setIsNoMovieModalVisible] = useState(false);

  // Do Testów
  const staticPageSize = 4;
  const totalPages = pageInfo.totalPages;

  // Załadowanie listy wszystkich filmów na sam start, oraz przy zmianie page'a 
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const response = await fetchMoviesByFilters({
          pageNumber: currentPage,
          pageSize: staticPageSize,
          titleSearch: searchText,
          orderBy: sortCategory || "title",
          sortDirection: sortDirection || "asc",
          categoryNames: filterList[0],
          countryNames: filterList[1],
          actorsList: filterList[2],
          directorsList: filterList[3],
        });

        const { data, totalItems, pageNumber, pageSize, totalPages } = response;
        setPageInfo({ totalItems, pageNumber, pageSize, totalPages });
        setMovies(data.$values);

        // Sprawdź czy nie ma wyników
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
            pageSize: 2,
            totalPages: 1,
          });
        }
        console.error("Błąd podczas pobieraniu filmów po filtrach:", error);
      }
    };

    loadMovies();
  }, [currentPage, searchText, sortCategory, sortDirection, filterList]);

  //                       PO KLIKNIĘCIU SZUKAJ:
  const handleSearchSubmit = async () => {
    setCurrentPage(1);
    try {
      const response = await fetchMoviesByFilters({
        pageNumber: 1,
        pageSize: staticPageSize,
        titleSearch: searchText,
        orderBy: sortCategory || "title",
        sortDirection: sortDirection || "asc",
        categoryNames: filterList[0],
        countryNames: filterList[1],
        actorsList: filterList[2],
        directorsList: filterList[3],
      });

      const { data, ...paginationData } = response;
      setPageInfo(paginationData);
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
          pageSize: 2,
          totalPages: 1,
        });
      }
      console.error("Błąd podczas pobieraniu filmów po filtrach:", error);
    }
  };

  //                       PO KLIKNIĘCIU SORTUJ:
  const handleSort = async(type: string) => {
    setCurrentPage(1);
    console.log(`Wybrano kategorię do sortowania: ${type}`);
    const typeArray = type.split(" ");
    const srtCategory = typeArray[0];
    const srtDirection = typeArray[1];
    setSortCategory(typeArray[0]);
    setSortDirection(typeArray[1]);
    try {
      const response = await fetchMoviesByFilters({
        pageNumber: 1,
        pageSize: staticPageSize,
        titleSearch: searchText,
        orderBy: srtCategory || "title",
        sortDirection: srtDirection || "asc",
        categoryNames: filterList[0],
        countryNames: filterList[1],
        actorsList: filterList[2],
        directorsList: filterList[3],
      });

      const { data, ...paginationData } = response;
      setPageInfo(paginationData);
      setMovies(data.$values);

      if (data.$values.length === 0) {
        setIsNoMovieModalVisible(true);
      }
    } catch (error) {
      // Obsługa błędów
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <SearchModule
        placeHolderText="Podaj tytuł filmu"
        getText={setSearchText}
        submit={handleSearchSubmit}
      />
      <FilterMovieModule getFilters={setFilterList} />

      <SortMovieModule onSort={handleSort} />

      <PaginationModule
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <MovieListModule movieList={movies} />

      <div className="mt-auto">
        <PaginationModule
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <NoMoviesModal
        show={isNoMovieModalVisible}
        onClose={() => setIsNoMovieModalVisible(false)}
      />
    </div>
  );
};

export default SearchMoviesPage;