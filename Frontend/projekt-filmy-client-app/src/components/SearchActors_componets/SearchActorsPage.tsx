import React, { useState } from "react";
import SearchModule from "../SearchModule";
import PaginationModule from "../PaginationModule";


const SearchActorsPage = () => {
    const [searchText, setSearchText] = useState<string>("");
    const [pageInfo, setPageInfo] = useState({
        totalItems: 0,
        pageNumber: 1,
        pageSize: 2,
        totalPages: 1,
      });
    const [currentPage, setCurrentPage] = useState(1);
    const staticPageSize = 2;
    const totalPages = pageInfo.totalPages;

    const handleSearchSubmit = () => {};

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };


    return (
        <div style={{ minHeight: "100vh" }}>
            <SearchModule
                placeHolderText="Podaj imię i nazwisko aktora"
                getText={setSearchText}
                submit={handleSearchSubmit}
            />

            {/* <SortMovieModule onSort={handleSort} /> */}

            <PaginationModule
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {/* <MovieListModule movieList={movies} /> */}

            {/* <NoMoviesModal
                show={isNoMovieModalVisible}
                onClose={() => setIsNoMovieModalVisible(false)}
            /> */}
        </div>
    );
};

export default SearchActorsPage;
