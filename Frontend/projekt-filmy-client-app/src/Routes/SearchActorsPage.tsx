import { useState } from "react";
import { usePeopleByRole } from "../API/PersonApi";
import SearchModule from "../components/SharedModals/SearchModule";
import PaginationModule from "../components/SharedModals/PaginationModule";
import PeopleListModule from "../components/People_componets/PeopleListModule";
import NoPeopleFoundModal from "../components/SharedModals/NoPeopleFoundModal";
import SpinnerLoader from "../components/SpinnerLoader";

const SearchActorsPage = () => {
    const [searchText, setSearchText] = useState<string>("");
    const [isNoPeopleFoundVisable, setIsNoPeopleFoundVisable] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const staticPageSize = 4;

    //API hook
    const { data: paginatedActors, isLoading, error } = usePeopleByRole(currentPage, staticPageSize, 1, searchText);
    const actors = paginatedActors?.people ?? [];
    const totalPages = paginatedActors?.totalPages ?? 1;

    const handleSearchSubmit = async () => {
      setCurrentPage(1);
      if (actors.length === 0) setIsNoPeopleFoundVisable(true);
    };

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

    return (
      <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
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

        {isLoading ? (
          <SpinnerLoader />
        ) : (
          <PeopleListModule peopleList={actors} type={"actor"} />
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

export default SearchActorsPage;
