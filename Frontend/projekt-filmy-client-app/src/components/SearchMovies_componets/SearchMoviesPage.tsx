import React, { ReactNode, useState } from "react";
import SearchModule from "../SearchModule";
import FilterMovieModule from "./FilterMovieModule";
import PaginationModule from "../PaginationModule";
import SortMovieModule from "./SortMovieModule";


const SearchMoviesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 20;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

   const handleSort = (category: string) => {
     console.log(`Wybrano kategorię do sortowania: ${category}`);
     // Tutaj można dodać logikę sortowania.
   };

  return (
    <div className="vh-100">
      <SearchModule placeHolderText="Podaj tytuł filmu" />
      <FilterMovieModule />

      <SortMovieModule onSort={handleSort} />

      <PaginationModule
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default SearchMoviesPage;