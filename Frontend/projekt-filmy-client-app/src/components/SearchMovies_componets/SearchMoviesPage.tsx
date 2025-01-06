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
  const staticPageSize = 2;
  const totalPages = pageInfo.totalPages;

  // Załadowanie listy wszystkich filmów na sam start, oraz przy zmianie page'a 
  useEffect(() => {
    axios
      .get("https://localhost:7053/api/Movies/by-filters", {
        params: {
          pageNumber: currentPage,
          pageSize: staticPageSize, // odpowiedzialna za ilość jednocześnie wyświetlanych filmów
          titleSearch: searchText,
          orderBy: sortCategory ? sortCategory : "title",
          sortDirection: sortDirection ? sortDirection : "asc",

          categoryNames: filterList[0],
          countryNames: filterList[1],
          actorsList: filterList[2],
          directorsList: filterList[3],
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" }); // Powtarza klucz dla każdej wartości
        }
      })
      .then((response) => {
        if (response.data) {
          const { data, totalItems, pageNumber, pageSize, totalPages } =
            response.data;
          setPageInfo({
            totalItems,
            pageNumber,
            pageSize,
            totalPages,
          });
          setMovies(data.$values);
          console.log("Załadowano filmy.", data);
          console.log(pageInfo);
        } else {
          setMovies([]);
        }
      })
      .catch((error) => console.error("Error fetching movies:", error));
  }, [currentPage]);

  //                       PO KLIKNIĘCIU SZUKAJ:
  const handleSearchSubmit = () => {
    setCurrentPage(1);
    console.log("handleSearchSubmit");
    console.log("searchText:", searchText);
    console.log("sortCategory:", sortCategory);
    console.log("sortDirection:", sortDirection);
    console.log("filterList-gatunki:", filterList[0]);

    axios
      .get("https://localhost:7053/api/Movies/by-filters", {
        params: {
          pageNumber: currentPage,
          pageSize: staticPageSize, // odpowiedzialna za ilość jednocześnie wyświetlanych filmów
          titleSearch: searchText,
          orderBy: sortCategory ? sortCategory : "title",
          sortDirection: sortDirection ? sortDirection : "asc",
          categoryNames: filterList[0],
          countryNames: filterList[1],
          actorsList: filterList[2],
          directorsList: filterList[3],
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" }); // Powtarza klucz dla każdej wartości
        },
      })
      .then((response) => {
        if (response.data) {
          const { data, totalItems, pageNumber, pageSize, totalPages } =
            response.data;
          setPageInfo({
            totalItems,
            pageNumber,
            pageSize,
            totalPages,
          });
          setMovies(data.$values);
          console.log("Załadowano filmy.", data);
          console.log(pageInfo);
        } else {
          setMovies([]);
        }
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          // Obsługa AxiosError
          if (error.response) {
            // Serwer zwrócił odpowiedź z kodem błędu
            console.error(
              `Error ${error.response.status}: ${
                error.response.data?.message || "Wystąpił błąd"
              }`
            );
            if (error.response.status === 404) {
              // Obsługa błędu 404
              console.error("Nie znaleziono zasobu.");
              setMovies([]);
              setPageInfo({
                totalItems: 0,
                pageNumber: 1,
                pageSize: 2,
                totalPages: 1,
              });
              setIsNoMovieModalVisible(true);
            }
          }
        } else {
          // Inny rodzaj błędu (nie związany z Axios)
          console.error("Nieznany błąd:", error);
        }
      });
  };

  //                       PO KLIKNIĘCIU SORTUJ:
  const handleSort = (type: string) => {
    setCurrentPage(1);
    console.log(`Wybrano kategorię do sortowania: ${type}`);
    const typeArray = type.split(" ");
    const srtCategory = typeArray[0];
    const srtDirection = typeArray[1];
    setSortCategory(typeArray[0]);
    setSortDirection(typeArray[1]);
    axios
      .get("https://localhost:7053/api/Movies/by-filters", {
        params: {
          pageNumber: currentPage,
          pageSize: staticPageSize,

          titleSearch: searchText,

          // Nie można korzystać z zmiennych useState, które się nadpisuje w tej samej funkci,
          // dlatego korzystam z lokalnej zmiennej dla tej funkcji
          orderBy: srtCategory ? srtCategory : "title",
          sortDirection: srtDirection ? srtDirection : "asc",

          categoryNames: filterList[0],
          countryNames: filterList[1],
          actorsList: filterList[2],
          directorsList: filterList[3],
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" }); // Powtarza klucz dla każdej wartości
        },
      })
      .then((response) => {
        if (response.data) {
          const { data, totalItems, pageNumber, pageSize, totalPages } =
            response.data;
          setPageInfo({
            totalItems,
            pageNumber,
            pageSize,
            totalPages,
          });
          setMovies(data.$values);
          console.log("Załadowano filmy.", data);
          console.log(pageInfo);
        } else {
          setMovies([]);
        }
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          // Obsługa AxiosError
          if (error.response) {
            // Serwer zwrócił odpowiedź z kodem błędu
            console.error(
              `Error ${error.response.status}: ${
                error.response.data?.message || "Wystąpił błąd"
              }`
            );
            if (error.response.status === 404) {
              // Obsługa błędu 404
              console.error("Nie znaleziono zasobu.");
              setMovies([]);
              setPageInfo({
                totalItems: 0,
                pageNumber: 1,
                pageSize: 2,
                totalPages: 1,
              });
              setIsNoMovieModalVisible(true);
            }
          }
        } else {
          // Inny rodzaj błędu (nie związany z Axios)
          console.error("Nieznany błąd:", error);
        }
      });
    // Tutaj można dodać logikę sortowania.
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ minHeight: "100vh" }}>
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

      <NoMoviesModal show={isNoMovieModalVisible} onClose={() => setIsNoMovieModalVisible(false)}/>
    </div>
  );
};

export default SearchMoviesPage;