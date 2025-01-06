import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Movie } from '../../models/Movie';
import { renderStars } from "../../functions/starFunction";


interface Props {
  movieList:Movie[]
}

const MovieListModule = ({ movieList }: Props) => {
  return (
    <div className="container d-flex justify-content-center align-items-top p-0">
      <ul className="list-group">
        {movieList.map((movie) => (
          <li className="list-group-item d-flex align-items-start p-3" style={{ borderBottom: "1px solid #ddd", width: "600px", height: "180px", borderRadius: "15px", marginBottom: "5px"}}>
            <img 
              src={movie.posterUrl} 
              alt={`${movie.title} Poster`} 
              style={{ 
                width: "100px", 
                height: "150px", 
                objectFit: "cover", 
                marginRight: "15px", 
                borderRadius: "5px"
              }}
            />
             <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {/* Tytuł filmu i oceny */}
              <div className="d-flex justify-content-between align-items-start">
                {/* Tytuł filmu */}
                <h5
                  className="mb-2"
                  style={{
                    marginRight: "20px",
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                  }}
                >
                  {movie.title} (
                  {movie.releaseDate
                    ? new Date(movie.releaseDate).toLocaleDateString("pl-PL", {
                        year: "numeric",
                      })
                    : null}
                  )
                </h5>

                {/* Gwiazdki i ilość ocen */}
                <div
                  className="d-flex flex-column align-items-end"
                  style={{ marginLeft: "10px" }}
                >
                  <div>{renderStars(movie.averageScore || 0)}</div>
                  <span style={{ fontSize: "1rem" }}>
                    {Number(movie.averageScore).toFixed(1)}/5
                  </span>
                  <p className="mb-0 mt-2" style={{ fontSize: "0.9rem" }}>
                    Ilość ocen: {movie.scoresNumber || "Brak danych"}
                  </p>
                </div>
              </div>

              {/* Gatunki */}
              <div
                className="d-flex flex-wrap"
                style={{
                  fontSize: "0.9rem",
                  color: "#555",
                  justifyContent: "flex-start",
                }}
              >
                {movie?.categories?.$values?.length ? (
                  movie.categories.$values.map((cat) => (
                    <div
                      key={cat.name}
                      className="badge me-2 mb-2"
                      style={{
                        backgroundColor: "#2E5077",
                        padding: "8px 12px",
                        textAlign: "center",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "40px",
                        color: "white",
                        borderRadius: "15px"
                      }}
                    >
                      {cat.name}
                    </div>
                  ))
                ) : (
                  <p className="text-dark">Brak danych o gatunkach.</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieListModule;