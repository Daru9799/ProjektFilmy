//Strona potem do usunięcia

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Movie } from '../../models/Movie';


const TestPage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pageInfo, setPageInfo] = useState({
        totalItems: 0,
        pageNumber: 1,
        pageSize: 2,
        totalPages: 0,
      });

    useEffect(() => {
        const fetchMovies = async () => {
          try {
            setLoading(true);
            const response = await axios.get("https://localhost:7053/api/Movies/all", {
              params: {
                pageNumber: 1,
                pageSize: 2,
                orderBy: "year",
                sortDirection: "asc",
              },
            });
            const { data, totalItems, pageNumber, pageSize, totalPages } = response.data;

            console.log('Dane z API:', data);

            setMovies(data.$values); //data zawiera dane filmów

            setPageInfo({
                totalItems,
                pageNumber,
                pageSize,
                totalPages,
              });
          } catch (err: any) {
            if (axios.isAxiosError(err)) {
              if (!err.response) {
                setError("Błąd sieci: nie można połączyć się z serwerem.");
              } else {
                setError(`Błąd: ${err.response.status} - ${err.response.statusText}`);
              }
            } else {
              setError("Wystąpił nieoczekiwany błąd.");
            }
            console.error(err);
          } finally {
            setLoading(false);
          }
        };
    
        fetchMovies();
      }, []);
    
      if (loading) return <p>Ładowanie danych...</p>;
      if (error) return <p>{error}</p>;

    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", color: "white" }}>
            <p>Tutaj testuje backend</p>
            <h1>Lista filmów https://localhost:7053/api/Movies/all</h1>
            <h2>Info z paginacji</h2>
            <p>Aktualna strona: {pageInfo.pageNumber}</p>
            <p>Rozmiar strony: {pageInfo.pageSize}</p>
            <p>Wszystkich elementów w bazie: {pageInfo.totalItems}</p>
            <p>Wszystkich stron: {pageInfo.totalPages}</p>
            <ul>
                {movies.map((movie) => (
                <li key={movie.movieId} style={{ marginBottom: "20px" }}>
                    <h2>{movie.title}</h2>
                    <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    style={{ width: "200px", height: "300px", objectFit: "cover" }}
                    />
                    <p>Opis: {movie.description}</p>
                    <p>Data premiery: {new Date(movie.releaseDate).toLocaleDateString()}</p>
                    <p>Czas trwania: {movie.duration} minut</p>
                    <p>Liczba recenzji: {movie.reviewsNumber}</p>
                    <p>Liczba ocen: {movie.scoresNumber}</p>
                    <p>Średnia ocena: {movie.averageScore.toFixed(2)}</p>

                    <p><strong>Kategorie: </strong> 
                        {movie.categories && movie.categories.$values && movie.categories.$values.length > 0 ? (
                            movie.categories.$values.map((category) => (
                            <span key={category.categoryId}>{category.name}  </span>
                            ))
                        ) : (
                            <span>Brak kategorii</span>
                        )}
                    </p>

                    <p><strong>Reżyser: </strong> 
                        {movie.directors && movie.directors.$values && movie.directors.$values.length > 0 ? (
                            movie.directors.$values.map((director) => (
                            <span key={director.directorId}>{director.firstName}  {director.lastName}</span>
                            ))
                        ) : (
                            <span>Brak reżyserów</span>
                        )}
                    </p>

                    <p><strong>Kraj produkcji: </strong> 
                        {movie.countries && movie.countries.$values && movie.countries.$values.length > 0 ? (
                            movie.countries.$values.map((country) => (
                            <span key={country.countryId}>{country.name} </span>
                            ))
                        ) : (
                            <span>Brak reżyserów</span>
                        )}
                    </p>
                </li>
                ))}
            </ul>
      </div>
    );
};

export default TestPage;