import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Review } from "../../models/Review";

const ReviewsPage = () => {
  const movieId = "6b27aed7-2b95-40ff-8bfa-98c4931b235e";  // Stałe ID dla testów
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReviewsByMovieId = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7053/api/Reviews/by-movie-id/${movieId}`
        );
        console.log("Dane z serwera:", response.data);  // Logowanie danych
        setReviews(response.data.$values);
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

    fetchReviewsByMovieId();
  }, [movieId]);

  // Funkcja do generowania gwiazdek
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);  // Całkowite gwiazdki
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;  // Pół gwiazdki
    const emptyStars = 5 - fullStars - halfStars;  // Puste gwiazdki

    let stars = [];

    // Dodaj pełne gwiazdki
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star" style={{ color: "#FFD700" }}></i>);
    }

    // Dodaj pół gwiazdki
    if (halfStars) {
      stars.push(<i key="half" className="fas fa-star-half-alt" style={{ color: "#FFD700" }}></i>);
    }

    // Dodaj puste gwiazdki
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star" style={{ color: "#FFD700" }}></i>);
    }

    return (
      <div>
        {stars}
        <p>{rating.toFixed(1)} / 5</p> {/* Showing rating text */}
      </div>
    );
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
        Recenzje filmu
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
              <small>20.12.2024{/* review.date */}</small>
            </div>
          </div>
        ))
      ) : (
        <p>Brak recenzji dla tego filmu.</p>
      )}
    </div>
  );
};

export default ReviewsPage;
