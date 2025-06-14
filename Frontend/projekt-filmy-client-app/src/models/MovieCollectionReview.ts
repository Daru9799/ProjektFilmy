import { MovieCollection } from "./MovieCollection";

export interface MovieCollectionReview {
  movieCollectionReviewId: string;
  rating: number;
  comment: string;
  date: string;
  likesCounter: number;
  spoilers: boolean;
  movieCollection: MovieCollection;
  userName: string;
  userId: string;
}

export interface MovieCollectionReviewResponse {
  $values: MovieCollectionReview[];
}
