import { useState } from "react";
import PeopleListModule from "../components/People_componets/PeopleListModule";
import { usePeopleByRole } from "../API/PersonApi";
import SearchModule from "../components/SharedModals/SearchModule";
import PaginationModule from "../components/SharedModals/PaginationModule";
import NoPeopleFoundModal from "../components/SharedModals/NoPeopleFoundModal";
import SpinnerLoader from "../components/SpinnerLoader";
import ApiErrorDisplay from "../components/ApiErrorDisplay";

const SearchDirectorsPage = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [isNoPeopleFoundVisable, setIsNoPeopleFoundVisable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const staticPageSize = 4;

  //API hook
  const { data: paginatedDirectors, isLoading, apiError: directorListError } = usePeopleByRole(currentPage, staticPageSize, 0, searchText);
  const directors = paginatedDirectors?.people ?? [];
  const totalPages = paginatedDirectors?.totalPages ?? 1;

  const handleSearchSubmit = async () => {
    setCurrentPage(1);
    if (directors.length === 0) setIsNoPeopleFoundVisable(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <SearchModule
        placeHolderText="Podaj imię i nazwisko reżysera"
        getText={setSearchText}
        submit={handleSearchSubmit}
      />

      {/* <SortMovieModule onSort={handleSort} /> */}

      <PaginationModule
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      
      {isLoading ? (
        <SpinnerLoader />
      ) : directorListError ? (
        <ApiErrorDisplay apiError={directorListError} />
      ) : (
        <PeopleListModule peopleList={directors} type={"director"} />
      )}

      <div className="mt-auto">
        <PaginationModule
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <NoPeopleFoundModal
        show={isNoPeopleFoundVisable}
        onClose={() => setIsNoPeopleFoundVisable(false)}
      />
    </div>
  );
};

export default SearchDirectorsPage;
