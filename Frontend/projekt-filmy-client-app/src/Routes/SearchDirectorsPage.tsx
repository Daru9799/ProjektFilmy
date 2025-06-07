import { useEffect, useState } from "react";
import PeopleListModule from "../components/People_componets/PeopleListModule";
import { Person } from "../models/Person";
import { fetchByPersonSearchAndRole, fetchPeopleByRole } from "../API/personApi";
import SearchModule from "../components/SharedModals/SearchModule";
import PaginationModule from "../components/SharedModals/PaginationModule";
import NoPeopleFoundModal from "../components/SharedModals/NoPeopleFoundModal";

const SearchDirectorsPage = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [person, setPerson] = useState<Person[]>([]);
  const [isNoPeopleFoundVisable, setIsNoPeopleFoundVisable] = useState(false);
  const [pageInfo, setPageInfo] = useState({
    totalItems: 0,
    pageNumber: 1,
    pageSize: 2,
    totalPages: 1,
  });

  // setError i loading trzeba jeszcze zaimplementować
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const staticPageSize = 4;
  const totalPages = pageInfo.totalPages;

  useEffect(() => {
    fetchPeopleByRole(
      currentPage,
      staticPageSize,
      "",
      0,
      setPerson,
      setPageInfo,
      setError,
      setLoading
    );
  }, [currentPage]);

  const handleSearchSubmit = async () => {
    setCurrentPage(1);
    const results = await fetchByPersonSearchAndRole(
      currentPage,
      staticPageSize,
      searchText,
      0,
      setPerson,
      setPageInfo
    );
    setIsNoPeopleFoundVisable(results.length === 0);
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

      <PeopleListModule peopleList={person} type={"director"} />

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
