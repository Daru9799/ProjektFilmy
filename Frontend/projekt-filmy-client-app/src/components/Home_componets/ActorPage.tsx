import React, { act, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Actor } from "../../models/Actor";
import ImageModal from "../../functions/ImageModal"; // Zmień ścieżkę na właściwą dla Twojego projektu

const ActorPage = () => {
  const actorId = "2a0be9b1-36d6-4411-923c-21f7f0ab7c9d";
  const [actor, setActor] = useState<Actor | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActorById = async () => {
      try {
        const actorResponse = await axios.get(`https://localhost:7053/api/Actors/${actorId}`);
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

    fetchActorById();
  }, [actorId]);

  if (loading) return <p>Ładowanie danych...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="vh-100 container-fluid text-white" style={{ left: "200px" }}>
      <div className="row my-4">
        {/* Left Column (Poster) */}
        <div className="col-3">
          <div className="p-2 text-center">
            {/* Użycie ImageModal */}
            <ImageModal
              imageUrl={actor?.photoUrl}
              altText={`${actor?.firstName} ${actor?.lastName} Poster`}
              defaultImageUrl="/path/to/defaultPoster.jpg"
            />
          </div>
        </div>

        {/* Middle Column (Details) */}
        <div className="col-8" style={{ textAlign: "left", marginLeft: "50px", marginTop: "20px" }}>
          {/* Title (Actor's Name) */}
          <h2 className="mb-3" style={{ fontSize: "4rem" }}>
            {actor?.firstName && actor?.lastName ? `${actor.firstName} ${actor.lastName}` : "Imię i nazwisko niedostępne"}
          </h2>

          {/* Data urodzenia */}
          <p style={{ marginTop: "50px" }}>
            <span className="fw-bold">Data urodzenia: </span>
            {actor?.birthDate
              ? new Date(actor.birthDate).toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" })
              : "Brak danych"}
          </p>
          <p style={{ marginTop: "10px" }}>
            <span className="fw-bold">Liczba wszystkich filmów: </span>
              {actor?.totalMovies ? `${actor.totalMovies}` : "Niedostępna"}
          </p>
          <p style={{ marginTop: "10px" }}>
            <span className="fw-bold">Najczęściej gra w: </span>
              {actor?.favoriteGenre ? `${actor.favoriteGenre}` : "Niedostępny"}
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
            <p className="text-dark">{actor?.bio || "Brak danych o biografii."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActorPage;
