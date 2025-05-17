export interface Person {
    personId: string;
    firstName: string;
    lastName: string;
    bio: string;
    birthDate: string;
    photoUrl: string;
    totalMovies: number;
    favoriteGenre: string;
}

export interface PeopleResponse {
    $values: Person[];
}