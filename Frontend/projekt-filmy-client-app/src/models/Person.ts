import { UserResponse } from "./UserProfile";

export interface Person {
  personId: string;
  firstName: string;
  lastName: string;
  bio: string;
  birthDate: string;
  photoUrl: string;
  totalMovies: number;
  favoriteGenre: string;
  followers?: UserResponse;
}

export interface PeopleResponse {
  $values: Person[];
}
