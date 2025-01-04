import { Movie } from "./Movie";

export interface Category {
    categoryId: string;
    name: string;
    //movies: Movie[];
}

export interface CategoryResponse {
    $values: Category[];
  }

