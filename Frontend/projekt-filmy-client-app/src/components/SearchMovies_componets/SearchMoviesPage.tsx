import React, { ReactNode, useEffect, useState } from "react";
import SearchModule from "../SearchModule";
import FilterMovieModule from "./FilterMovieModule";
import PaginationModule from "../PaginationModule";
import SortMovieModule from "./SortMovieModule";
import { Category } from "../../models/Category";
import { Country } from "../../models/Country";
import { Actor } from "../../models/Actor";
import { Director } from "../../models/Director";
import axios from "axios";
import { Movie } from "../../models/Movie";
import MovieListModule from "./MovieListModule";

const SearchMoviesPage = () => {
  const [searchText, setSearchText] = useState<string>("")
  const [filterList, setFilterList] = useState<[string[],string[],Actor[],Director[]]>([[],[],[],[]])
  const [movies, setMovies] = useState<Movie[]>([])
  const [pageInfo, setPageInfo] = useState({
    totalItems: 0,
    pageNumber: 1,
    pageSize: 2,
    totalPages: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 20;

  // Załadowanie listy wszystkich filmów
  useEffect(() => {
    axios
      .get("https://localhost:7053/api/Movies/all", {
        params: {
          pageNumber: currentPage,
          pageSize: 3, // odpowiedzialna za ilość jednocześnie wyświetlanych filmów
          orderBy: "year",
          sortDirection: "asc",
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
      .catch((error) => console.error("Error fetching movies:", error));
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchSubmit = () =>{
    console.log("handleSearchSubmit");
    console.log("searchText:",searchText);
    console.log("searchText:", filterList);

  }

  const handleSort = (type: string) => {
    console.log(`Wybrano kategorię do sortowania: ${type}`);
    const typeArray = type.split(" ");
    const category = typeArray[0]
    const direction = typeArray[1];
    console.log(category,direction);

    axios
      .get("https://localhost:7053/api/Movies/all", {
        params: {
          pageNumber: currentPage,
          pageSize: 3, // odpowiedzialna za ilość jednocześnie wyświetlanych filmów
          orderBy: { category},
          sortDirection: { direction },
        },
      })
      .then((response) => {
        if (response.data) {
          const { data, totalItems, pageNumber, pageSize, totalPages } = response.data;
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
    // Tutaj można dodać logikę sortowania.
  };

  return (
    <div style={{minHeight:"100vh"}}>
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

    </div>
  );
};

export default SearchMoviesPage;