import { CategoryResponse } from "./Category";
import { CountryResponse } from "./Country";
import { PeopleResponse } from "./Person";
import { UserResponse } from "./UserProfile";

export interface Movie {
  movieId: string;
  title: string;
  releaseDate: string; // ISO 8601 string
  posterUrl: string;
  description: string;
  duration: number;
  reviewsNumber: number;
  scoresNumber: number;
  averageScore: number;
  categories?: CategoryResponse; //Trzeba dac tak bo inaczej nie da sie obsluzyc zwracanych list obiektów
  countries?: CountryResponse;
  directors?: PeopleResponse;
  followers?: UserResponse;
}

export interface MovieResponse {
  $values: Movie[]
} 