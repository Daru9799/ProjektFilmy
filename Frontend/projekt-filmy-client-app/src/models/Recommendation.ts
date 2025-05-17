export interface Recommendation {
      recommendationId: string;
      likesCounter: number;
      recommendedMovieId: string;
      isLiking: boolean;
  }
  
  export interface RecommendationResponse {
    $values: Recommendation[];
  }