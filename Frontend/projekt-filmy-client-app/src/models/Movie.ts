import {Actor} from "./Actor";

export interface Movie{
    MovieId: string;
    Title: string;
    ReleaseDate: string; // ISO 8601 string
    PosterUrl: string;

    Actors: Actor[]
}