import {Actor} from '../models/Actor'
import {CountryResponse} from '../models/Country';
import {CategoryResponse} from '../models/Category';
import { Person } from './Person';

export interface RatingCount {
  rating: number;
  count: number;
}

export interface UserStats {
  hoursOfWathcedMovies: number;
  numberOfWathcedMovies: number;
  numberOfPlannedMovies: number;
  numberOfReviews: number;
  favoriteDirector: Person;
  favoriteActor: Actor;
  watchedMoviesByCategory: { $values: CategoryResponse[] };
  watchedMoviesByCountry: { $values: CountryResponse[] };
  ratingDistribution: { $values: RatingCount[] };
}
