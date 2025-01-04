export interface Review{
    reviewId: string;
    rating: number;
    comment: string;
    date: string;
    username: string;
    movieTitle: string;
    userId: string;
    movieId: string;
    isCritic: boolean; //Jeśli krytyk to true
}

//export interface ReviewResponse {
//    $values: Review[];
//}