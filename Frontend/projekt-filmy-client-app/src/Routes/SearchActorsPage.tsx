import { useEffect, useState } from "react";
import { Person } from "../models/Person";
import { fetchByPersonSearchAndRole, fetchPeopleByRole } from "../API/personApi";
import SearchModule from "../components/SharedModals/SearchModule";
import PaginationModule from "../components/SharedModals/PaginationModule";
import PeopleListModule from "../components/People_componets/PeopleListModule";
import NoPeopleFoundModal from "../components/SharedModals/NoPeopleFoundModal";


const SearchActorsPage = () => {
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
          1,
          setPerson,
          setPageInfo,
          setError,
          setLoading
        );
      }, [currentPage]);

    const handleSearchSubmit = async () => {
        setCurrentPage(1);
        await fetchByPersonSearchAndRole(currentPage, staticPageSize, searchText, 1, setPerson, setPageInfo);
        if(person.length === 0) setIsNoPeopleFoundVisable(true);
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

        <PeopleListModule peopleList={person} type={"actor"} />

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
