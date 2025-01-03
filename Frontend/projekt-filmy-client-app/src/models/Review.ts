export interface Review{
reviewId:number;
rating:number;
comment:string;
userId:string;
movieId:string
}

export interface ReviewResponse {
    $values: Review[];
}