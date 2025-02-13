import React, { useEffect, useState } from "react";
import SearchModule from "../SearchModule";
import PaginationModule from "../PaginationModule";
import { Director } from "../../models/Director";
import NoPeopleFoundModal from "../NoPeopleFoundModal";
import axios from "axios";
import DirectorsListModule from "./DirectorsListModule";

const SearchDirectorsPage = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [directors, setDirectors] = useState<Director[]>([]);
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
    axios
      .get("https://localhost:7053/api/Directors/all", {
        params: {
          pageNumber: currentPage,
          pageSize: staticPageSize,
          directorSearch: searchText,
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
          setDirectors(data.$values);
          console.log("Załadowano reżyserów.", data);
          console.log(pageInfo);
        } else {
          setDirectors([]);
        }
      })
      .catch((error) => console.error("Error fetching movies:", error));
  }, [currentPage]);

  const handleSearchSubmit = () => {
    setCurrentPage(1);
    axios
      .get("https://localhost:7053/api/Directors/all", {
        params: {
          pageNumber: currentPage,
          pageSize: staticPageSize, // odpowiedzialna za ilość jednocześnie wyświetlanych filmów
          directorSearch: searchText,
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
          if (data.$values.length === 0) {
            setIsNoPeopleFoundVisable(true);
            setPageInfo({
              totalItems: totalItems,
              pageNumber: 1,
              pageSize: pageSize,
              totalPages: 1,
            });
          }
          setDirectors(data.$values);
          console.log("Załadowano aktorów.", data);
          console.log(pageInfo);
        } else {
          setDirectors([]);
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
              setDirectors([]);
              setPageInfo({
                totalItems: 0,
                pageNumber: 1,
                pageSize: 2,
                totalPages: 1,
              });
              setIsNoPeopleFoundVisable(true);
            }
          }
        } else {
          // Inny rodzaj błędu (nie związany z Axios)
          console.error("Nieznany błąd:", error);
        }
      });
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

      <DirectorsListModule directorsList={directors} />

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
