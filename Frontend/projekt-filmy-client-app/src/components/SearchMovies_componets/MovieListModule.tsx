import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Movie } from '../../models/Movie';


interface Props {
  movieList:Movie[]
}

const MovieListModule = ({ movieList }: Props) => {
  const [searchText, setSearchText] = useState<string>("");

  return (
    <div className="container d-flex justify-content-center align-items-top p-0">
      <ul className="list-group">
        {movieList.map((movie) => (
          <li className="list-group-item">
            {movie.title} |
            {movie.categories &&
            movie.categories.$values &&
            movie.categories.$values.length > 0 ? (
              movie.categories.$values.map((category) => (
                <span key={category.categoryId}>{category.name}, </span>
              ))
            ) : (
              <span>Brak kategorii</span>
            )} | Średnia ocena: {movie.averageScore.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieListModule;