import { Category } from './Category';
import { Country } from './Country';

export interface Movie {
    movieId: string;
    title: string;
    releaseDate: string;  // ISO 8601 string
    posterUrl: string;
    description: string;
    duration: number;
    reviewsNumber: number;
    scoresNumber: number;
    averageScore: number;
    categories: Category[];
    countries: Country[];
}