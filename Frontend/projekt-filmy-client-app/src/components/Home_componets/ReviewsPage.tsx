import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Review } from "../../models/Review";
import { renderStars } from "../../functions/starFunction"; // Import funkcji
import PaginationModule from "../PaginationModule";

const ReviewsPage = () => {
  const movieId = "073BBF7F-A276-46A9-A221-D77C592EC39D"; // Stałe ID dla testów
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({
    totalItems:1,
    pageNumber: 1,
    pageSize:5,
    totalPages: 1,
  });

  useEffect(() => {
    const fetchReviewsByMovieId = async (page: number,pageS:number) => {
      try {
        const response = await axios.get(
          `https://localhost:7053/api/Reviews/by-movie-id/${movieId}`, {
            //Argumenty do backendu dotyczące numeru strony i rozmiaru strony (potem trzeba to połączyć z panelem stron)
            params: {
              pageNumber: page,
              pageSize: pageS, 
            }
          });
        console.log("Dane z serwera:", response.data);
        //Tutaj zapisywane są kolejno do zmiennych reviewsData czyli lista recenzji i parametry dotyczące paginacji do uzycia potem przy tworzeniu stron
        const { data, totalItems, pageNumber, pageSize, totalPages } = response.data; 
        setReviews(data.$values); //Tutaj trzeba te dane przekazać do mapowania na obiekt
        setPagination({totalItems,pageNumber,pageSize,totalPages})

      } catch (err: any) {
        console.error("Błąd podczas pobierania danych: ", err);
        if (axios.isAxiosError(err)) {
          setError(err.response ? `${err.response.status} - ${err.response.statusText}` : "Błąd sieci.");
        } else {
          setError("Nieoczekiwany błąd.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReviewsByMovieId(pagination.pageNumber,pagination.pageSize);
  }, [pagination.pageNumber,pagination.pageSize]);

  if (loading) {
    return <div className="text-center">Ładowanie recenzji...</div>;
  }

  if (error) {
    return <div className="text-danger text-center">{error}</div>;
  }

  return (
    <div className="container my-4">
      <h2 className="mb-4" style={{ color: "white" }}>
        Recenzje filmu: {reviews[0].movieTitle}
      </h2>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div
            key={review.reviewId}
            className="d-flex justify-content-between align-items-start p-3 my-2"
            style={{
              backgroundColor: "white",
              borderRadius: "15px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              padding: "20px",
              color: "black",
            }}
          >
            <div style={{ flex: 1, textAlign: "left" }}>
              <p style={{ fontWeight: "bold" }}>{review.username}</p>
              <p>{review.comment}</p>
            </div>
            <div style={{ textAlign: "center", color: "black" }}>
              {renderStars(review.rating)}
              <h4>{review.rating}/5</h4>
              <small>{review?.date ? new Date(review.date).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' }) : "Brak danych"}</small>
            </div>
          </div>
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
