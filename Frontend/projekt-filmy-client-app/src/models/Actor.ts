import {Movie} from "./Movie";

export interface Actor {
    ActorId: string;
    ActorName: string;
    ActorLastName: string;

    Movies: Movie[];
}