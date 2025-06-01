import {Actor} from '../models/Actor'
import {Director} from '../models/Director'

export interface RatingCount {
  rating: number;
  count: number;
}

export interface CountryCount {
  country: string;
  count: number;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface UserStats {
  hoursOfWathcedMovies: number;
  numberOfWathcedMovies: number;
  numberOfPlannedMovies: number;
  numberOfReviews: number;
  favoriteDirector: Director;
  favoriteActor: Actor;
  watchedMoviesByCategory: { $values: CategoryCount[] };
  watchedMoviesByCountry: { $values: CountryCount[] };
  ratingDistribution: { $values: RatingCount[] };
}
