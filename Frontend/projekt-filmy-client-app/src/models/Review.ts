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
    isOwner: boolean; //Sprawdza czy user jest wlascicielem recenzji
}

//export interface ReviewResponse {
//    $values: Review[];
//}