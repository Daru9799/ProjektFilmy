export interface Actor {
    actorId: string;
    firstName: string;
    lastName: string;
    bio: string;
    birthDate: string;
    photoUrl: string;
    //Dodatkowe pola
    totalMovies: number;
    favoriteGenre: string;
}