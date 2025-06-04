import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Review } from "../../models/Review";
import PaginationModule from "../PaginationModule";
import SortReviewModule from "./SortReviewsModle"; 
import ReviewCard from "./ReviewCard"; 
import MovieListModule from "../SearchMovies_componets/MovieListModule"; 
import { useParams } from "react-router-dom";
import { Movie } from "../../models/Movie"; 
import { fetchReviewsByMovieId } from "../../API/reviewApi";
import { fetchMovieData } from "../../API/movieApi";

const ReviewsPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({
    totalItems: 1,
    pageNumber: 1,
    pageSize: 5,
    totalPages: 1,
  });
  const [sortOrder, setSortOrder] = useState<string>("rating"); // Domyślnie sortowanie po ocenie
  const [sortDirection, setSortDirection] = useState<string>("desc");
  const [movie, setMovie] = useState<Movie | null>(null); // State for movie details

  useEffect(() => {
    try{
      // Pobranie recenzji dla filmu
      fetchReviewsByMovieId(
        movieId,
        pagination.pageNumber,
        pagination.pageSize,
        sortOrder,
        sortDirection,
        setReviews,
        setPagination,
        setError
      );
      // Pobranie filmu dla którego są recenzje
      fetchMovieData(movieId, setMovie, setError);
    }
    finally{
      setLoading(false);
    }

  }, [pagination.pageNumber, pagination.pageSize, sortOrder, sortDirection, movieId]);

  const handleSortChange = (category: string) => {
    switch (category) {
      case "highRaiting":
        setSortOrder("rating");
        setSortDirection("desc");
        break;
      case "lowRaiting":
        setSortOrder("rating");
        setSortDirection("asc");
        break;
      case "new":
        setSortOrder("year");
        setSortDirection("desc");
        break;
      case "old":
        setSortOrder("year");
        setSortDirection("asc");
        break;
      default:
        break;
    }
  };

  if (loading) {
    return <div className="text-center">Ładowanie recenzji...</div>;
  }

  if (error) {
    return <div className="text-danger text-center">{error}</div>;
  }

  return (
    <div className="container my-4">
      <h2 className="mb-4" style={{ color: "white" }}>
        Recenzje filmu:
      </h2>
  
    {/* Komponent sortowania */}
    <SortReviewModule onSort={handleSortChange} />


<div style={{marginTop:"5%"}}>
  {movie && <MovieListModule movieList={movie ? [movie] : []} />}
</div>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <ReviewCard
            key={review.reviewId}
            review={review}
          />
        ))
      ) : (
        <p>Brak recenzji dla tego filmu.</p>
      )}

      {/* Komponent paginacji */}
      <PaginationModule
        currentPage={pagination.pageNumber}
        totalPages={pagination.totalPages}
        onPageChange={(page) =>
          setPagination((prev) => ({ ...prev, pageNumber: page }))
        }
      />
    </div>
  );
};

export default ReviewsPage;
