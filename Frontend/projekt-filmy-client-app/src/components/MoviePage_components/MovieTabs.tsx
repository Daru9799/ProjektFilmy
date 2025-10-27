import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Movie } from "../../models/Movie";
import { Person } from "../../models/Person";

interface MovieTabsProps {
  movie: Movie | null;
  people: Person[];
}

const MovieTabs: React.FC<MovieTabsProps> = ({ movie, people }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("opis");

  const tabButtons = [
    { id: "opis", label: "Opis" },
    { id: "gatunki", label: "Gatunki" },
    { id: "aktorzy", label: "Aktorzy" },
    { id: "kraje", label: "Kraje" },
  ];

  return (
    <>
      {/* Taby */}
      <ul className="nav nav-pills d-flex flex-wrap justify-content-center justify-content-md-start mb-3">
        {tabButtons.map(({ id, label }) => (
          <li key={id} className="nav-item me-2 mb-2 mb-md-0">
            <button
              className={`outside-table-button ${
                activeTab === id ? "outside-table-button-active" : ""
              }`}
              type="button"
              onClick={() => setActiveTab(id)}
              style={{ padding: "5px 10px", fontSize: "0.9rem" }}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>

      {/* Zawartość tabów */}
      <div
        className="bg-white p-3 shadow-sm"
        style={{
          fontSize: "1.1rem",
          minHeight: "140px",
          maxHeight: "300px",
          overflow: "auto",
          borderRadius: "20px",
          textAlign: "left",
          width: "100%",
        }}
      >
        <div className="tab-content">
          {/* Opis */}
          <div className={`tab-pane fade ${activeTab === "opis" ? "show active" : ""}`}>
            <p className="text-dark">{movie?.description || "Brak opisu filmu."}</p>
          </div>

          {/* Gatunki */}
          <div className={`tab-pane fade ${activeTab === "gatunki" ? "show active" : ""}`}>
            <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
              {movie?.categories?.$values?.length ? (
                movie.categories.$values.map((cat) => (
                  <button
                    key={cat.name}
                    className="inside-table-button"
                    style={{ padding: "5px 10px", fontSize: "0.9rem" }}
                    onClick={() => {}}
                  >
                    {cat.name}
                  </button>
                ))
              ) : (
                <p className="text-dark">Brak danych o gatunkach.</p>
              )}
            </div>
          </div>

          {/* Aktorzy */}
          <div className={`tab-pane fade ${activeTab === "aktorzy" ? "show active" : ""}`}>
            <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
              {people.length > 0 ? (
                people.map((person) => (
                  <button
                    key={person.personId}
                    className="inside-table-button"
                    style={{ padding: "5px 10px", fontSize: "0.9rem" }}
                    onClick={() => navigate(`/people/${person.personId}`)}
                  >
                    {person.firstName} {person.lastName}
                  </button>
                ))
              ) : (
                <p className="text-dark">Brak danych o aktorach</p>
              )}
            </div>
          </div>

          {/* Kraje */}
          <div className={`tab-pane fade ${activeTab === "kraje" ? "show active" : ""}`}>
            <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
              {movie?.countries?.$values?.length ? (
                movie.countries.$values.map((country) => (
                  <button
                    key={country.name}
                    className="inside-table-button"
                    style={{ padding: "5px 10px", fontSize: "0.9rem" }}
                    onClick={() => {}}
                  >
                    {country.name}
                  </button>
                ))
              ) : (
                <p className="text-dark">Brak danych o krajach</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieTabs;
