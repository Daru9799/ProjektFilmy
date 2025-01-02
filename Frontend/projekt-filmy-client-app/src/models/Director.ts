export interface Director {
    directorId: string;
    firstName: string;
    lastName: string;
    bio: string;
    birthDate: string;
    photoUrl: string;
}

export interface DirectorResponse {
    $values: Director[];
}