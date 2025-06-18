import { MovieResponse } from "./Movie";
import { MovieCollectionReviewResponse } from "./MovieCollectionReview";

export interface MovieCollection {
  movieCollectionId: string;
  title: string;
  description?: string;
  shareMode: "Private" | "Friends" | "Public";
  allowCopy: Boolean;
  type: CollectionType;
  likesCounter: number;
  userName: string;
  userId: string;
  movies: MovieResponse | null;
  movieCollectionReviews: MovieCollectionReviewResponse | null;
}

export enum VisibilityMode {
  Private,
  Friends,
  Public,
}

export enum CollectionType {
  watched,
  planned,
  custom,
}
