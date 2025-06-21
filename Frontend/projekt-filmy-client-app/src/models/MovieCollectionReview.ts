import { MovieCollection } from "./MovieCollection";

export interface MovieCollectionReview {
  movieCollectionReviewId: string;
  rating: number;
  comment: string;
  date: string;
  likesCounter: number;
  spoilers: boolean;
  movieCollectionId: string;
  username: string;
  userId: string;
  isCritic: boolean;
  isOwner: boolean;
}

export interface MovieCollectionReviewResponse {
  $values: MovieCollectionReview[];
}
