import React from "react";
import { useNavigate } from "react-router-dom";
import { Movie } from "../../models/Movie";
import { Person } from "../../models/Person";

interface MovieTabsProps {
  movie: Movie | null;
  people: Person[];
}

const MovieTabs: React.FC<MovieTabsProps> = ({ movie, people }) => {
  const navigate = useNavigate();

  return (
    <>
      <ul
        className="nav nav-pills"
        style={{
          marginBottom: "10px",
          marginTop: "30px",
          marginLeft: "20px",
        }}
      >
        <li className="nav-item">
          <button
            className="nav-link active"
            id="opis-tab"
            data-bs-toggle="pill"
            data-bs-target="#opis"
            type="button"
          >
            Opis
          </button>
        </li>
        <li className="nav-item">
          <button
            className="nav-link"
            id="gatunki-tab"
            data-bs-toggle="pill"
            data-bs-target="#gatunki"
            type="button"
          >
            Gatunki
          </button>
        </li>
        <li className="nav-item">
          <button
            className="nav-link"
            id="aktorzy-tab"
            data-bs-toggle="pill"
            data-bs-target="#aktorzy"
            type="button"
          >
            Aktorzy
          </button>
        </li>
        <li className="nav-item">
          <button
            className="nav-link"
            id="kraje-tab"
            data-bs-toggle="pill"
            data-bs-target="#kraje"
            type="button"
          >
            Kraje
          </button>
        </li>
      </ul>

      <div
        className="bg-white p-3 shadow-sm"
        style={{
          fontSize: "1.1rem",
          height: "140px",
          overflow: "auto",
          paddingRight: "10px",
          borderRadius: "20px",
          textAlign: "left",
          marginTop: "-10px",
          width: "80%",
        }}
      >
        <div className="tab-content">
          {/* Opis */}
          <div className="tab-pane fade show active" id="opis">
            <p className="text-dark">
              {movie?.description || "Brak opisu filmu."}
            </p>
          </div>

          {/* Gatunki */}
          <div className="tab-pane fade" id="gatunki">
            <div className="d-flex flex-wrap">
              {movie?.categories?.$values?.length ? (
                movie.categories.$values.map((cat) => (
                  <button key={cat.name} className="list-button" onClick={() => {}}>
                    {cat.name}
                  </button>
                ))
              ) : (
                <p className="text-dark">Brak danych o gatunkach.</p>
              )}
            </div>
          </div>

          {/* Aktorzy */}
          <div className="tab-pane fade" id="aktorzy">
            <div className="d-flex flex-wrap gap-2">
              {people.length > 0 ? (
                people.map((person) => (
                  <button
                    key={person.personId}
                    className="list-button"
                    onClick={() => navigate(`/actor/${person.personId}`)}
                  >
                    {person.firstName} {person.lastName}
                  </button>
                ))
              ) : (
                <p>Brak danych o aktorach</p>
              )}
            </div>
          </div>

          {/* Kraje */}
          <div className="tab-pane fade" id="kraje">
            <div className="d-flex flex-wrap">
              {movie?.countries?.$values?.length ? (
                movie.countries.$values.map((country) => (
                  <button key={country.name} className="list-button" onClick={() => {}}>
                    {country.name}
                  </button>
                ))
              ) : (
                <p>Brak danych o krajach</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieTabs;
