import { MovieCollection } from "./MovieCollection";

export interface MovieCollectionReview {
  movieCollectionReviewId: string;
  rating: number;
  comment: string;
  date: string;
  likesCounter: number;
  spoilers: boolean;
  movieCollection: MovieCollection;
  username: string;
  userId: string;
  isCritic: boolean;
  isOwner: boolean;
}

export interface MovieCollectionReviewResponse {
  $values: MovieCollectionReview[];
}
