import React, { ReactNode, useEffect, useState } from "react";
import MovieListModule from "../SearchMovies_componets/MovieListModule";
import axios, { AxiosError } from "axios";
import { Movie } from "../../models/Movie";

const HomePage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [pageInfo, setPageInfo] = useState({
      totalItems: 0,
      pageNumber: 1,
      pageSize: 2,
      totalPages: 1,
    });
    const [errorMessage, setErrorMessage] = useState("");
  
    // Do Testów
    const staticPageSize = 3;
    const currentPage = 1


  useEffect(() => {
    axios
      .get("https://localhost:7053/api/Movies/by-filters", {
        params: {
          pageNumber: currentPage,
          pageSize: staticPageSize, // odpowiedzialna za ilość jednocześnie wyświetlanych filmów
          orderBy: "rating",
          sortDirection:"desc",
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
        console.error("Error fetching movies:", error)
        setErrorMessage("Error fetching movies");
      });
  },[]);

  return (
    <div style={{ minHeight: "100vh" }}>
      <div
        style={{
          backgroundImage: "url('/imgs/cinema-background.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "400px",
          width: "100%",
        }}
        className="d-flex justify-content-center align-items-center"
      ></div>
      <div
        className="container-sm text-white py-3"
        style={{ backgroundColor: "#1A075A" }}
      >
        <h1 className="jersey-15-regular">WEBFILM</h1>
        <p>
          Witaj na stronie dzięki której będziesz mógł znaleść filmy do
          obejrzenia, wystawić im potem recenzje i sprawdzić recenzje innych
          użytkowników.
        </p>
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center py-2">
        <h1 className="mb-3 text-white jersey-15-regular">Top 3 filmy:</h1>
        <MovieListModule movieList={movies} />
      </div>
    </div>
  );
};

export default HomePage;
