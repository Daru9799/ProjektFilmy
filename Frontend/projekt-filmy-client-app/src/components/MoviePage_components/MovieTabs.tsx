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
  const [activeTab, setActiveTab] = useState<string>("opis");  // domyślnie włączona tablica

  const tabButtons = [
    { id: "opis", label: "Opis" },
    { id: "gatunki", label: "Gatunki" },
    { id: "aktorzy", label: "Aktorzy" },
    { id: "kraje", label: "Kraje" },
  ];

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
        {tabButtons.map(({ id, label }) => (
          <li key={id} className="nav-item">
            <button
              className={`outside-table-button ${activeTab === id ? "outside-table-button-active" : ""}`}
              id={`${id}-tab`}
              data-bs-toggle="pill"
              data-bs-target={`#${id}`}
              type="button"
              onClick={() => setActiveTab(id)}
            >
              {label}
            </button>
          </li>
        ))}
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
          <div className={`tab-pane fade ${activeTab === "opis" ? "show active" : ""}`} id="opis">
            <p className="text-dark">{movie?.description || "Brak opisu filmu."}</p>
          </div>

          <div className={`tab-pane fade ${activeTab === "gatunki" ? "show active" : ""}`} id="gatunki">
            <div className="d-flex flex-wrap">
              {movie?.categories?.$values?.length ? (
                movie.categories.$values.map((cat) => (
                  <button key={cat.name} className="inside-table-button" onClick={() => {}}>
                    {cat.name}
                  </button>
                ))
              ) : (
                <p className="text-dark">Brak danych o gatunkach.</p>
              )}
            </div>
          </div>

          <div className={`tab-pane fade ${activeTab === "aktorzy" ? "show active" : ""}`} id="aktorzy">
            <div className="d-flex flex-wrap gap-2">
              {people.length > 0 ? (
                people.map((person) => (
                  <button
                    key={person.personId}
                    className="inside-table-button"
                    onClick={() => navigate(`/people/${person.personId}`)}
                  >
                    {person.firstName} {person.lastName}
                  </button>
                ))
              ) : (
                <p>Brak danych o aktorach</p>
              )}
            </div>
          </div>

          <div className={`tab-pane fade ${activeTab === "kraje" ? "show active" : ""}`} id="kraje">
            <div className="d-flex flex-wrap">
              {movie?.countries?.$values?.length ? (
                movie.countries.$values.map((country) => (
                  <button key={country.name} className="inside-table-button" onClick={() => {}}>
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
