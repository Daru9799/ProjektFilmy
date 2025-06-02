import React, { useEffect, useState } from "react";
import SearchModule from "../SearchModule";
import PaginationModule from "../PaginationModule";
import NoPeopleFoundModal from "../NoPeopleFoundModal";
import axios from "axios";
import DirectorsListModule from "./DirectorsListModule";
import { Person } from "../../models/Person";
import { fetchByPersonSearchAndRole, fetchPeopleByRole } from "../../API/personApi";

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
      setPageInfo
    );
  }, [currentPage]);

  // !!! Błąd: Nie wyświetla komunikatu o braku szukanej osoby(reżysera) 
  const handleSearchSubmit = async () => {
    setCurrentPage(1);
    await fetchByPersonSearchAndRole(currentPage, staticPageSize, searchText, 0, setPerson, setPageInfo);
    if(person.length === 0) setIsNoPeopleFoundVisable(true);
    console.log("person.length: "+person.length);
    console.log(person);
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

      <DirectorsListModule directorsList={person} />

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
