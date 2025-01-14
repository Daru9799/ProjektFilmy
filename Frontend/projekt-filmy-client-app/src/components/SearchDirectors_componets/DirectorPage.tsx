import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Director } from "../../models/Director";
import ImageModal from "../../functions/ImageModal"; 
import MovieListModule from "../SearchMovies_componets/MovieListModule";
import { fetchDirectorMovies } from "../../functions/ReloadFunctions";
import { Movie } from "../../models/Movie";

const DirectorPage = () => {
  const { directorId } = useParams();
  const [director, setActor] = useState<Director | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [movies, setMovies] = useState<Movie[]>([]);


  useEffect(() => {
    const fetchDirectorById = async () => {
      try {
        const actorResponse = await axios.get(`https://localhost:7053/api/Directors/${directorId}`);
        setActor(actorResponse.data);
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

    fetchDirectorById();
    if(directorId)
    fetchDirectorMovies(directorId, setMovies, setError, setLoading);

  }, [directorId]);

  if (loading) return <p>Ładowanie danych...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className=" container-fluid text-white" style={{marginBottom:"2%", minHeight:"90vh"}}>
      <div className="row my-4">
        {/* Left Column (Poster) */}
        <div className="col-3">
          <div className="p-2 text-center">
            {/* Użycie ImageModal */}
            <ImageModal
              imageUrl={director?.photoUrl}
              altText={`${director?.firstName} ${director?.lastName} Poster`}
              defaultImageUrl="/path/to/defaultPoster.jpg"
            />
          </div>
        </div>

        {/* Middle Column (Details) */}
        <div className="col-8" style={{ textAlign: "left", marginLeft: "50px", marginTop: "20px" }}>
          {/* Title (Actor's Name) */}
          <h2 className="mb-3" style={{ fontSize: "4rem" }}>
            {director?.firstName && director?.lastName ? `${director.firstName} ${director.lastName}` : "Imię i nazwisko niedostępne"}
          </h2>

          {/* Data urodzenia */}
          <p style={{ marginTop: "50px" }}>
            <span className="fw-bold">Data urodzenia: </span>
            {director?.birthDate
              ? new Date(director.birthDate).toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" })
              : "Brak danych"}
          </p>
          <p style={{ marginTop: "10px" }}>
            <span className="fw-bold">Liczba wszystkich filmów: </span>
              {director?.totalMovies ? `${director.totalMovies}` : "Niedostępna"}
          </p>
          <p style={{ marginTop: "10px" }}>
            <span className="fw-bold">Najczęściej kręci: </span>
              {director?.favoriteGenre ? `${director.favoriteGenre}` : "Niedostępny"}
          </p>


          {/* Biografia */}
          <div
            className="bg-white p-3 shadow-sm"
            style={{
              fontSize: "1.1rem",
              minHeight: "140px",
              borderRadius: "20px",
              textAlign: "left",
              marginTop: "20px",
              marginRight: "50px",
            }}
          >
            <p className="text-dark">{director?.bio || "Brak danych o biografii."}</p>
          </div>
        </div>
      </div>

      {movies.length > 0 && (
          <p style={{ fontSize: "1.6rem", marginTop: "5%" }}>
            {movies.length === 1 ? "Powiązany film:" : "Powiązane filmy:"}
          </p>
        )}

        <MovieListModule movieList={movies}/>

    </div>
  );
};

export default DirectorPage;
