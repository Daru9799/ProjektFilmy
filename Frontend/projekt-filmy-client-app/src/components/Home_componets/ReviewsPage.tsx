import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios"; 
import "bootstrap/dist/css/bootstrap.min.css";
import { Review } from "../../models/Review";
import { renderStars } from "../../functions/starFunction"; 
import PaginationModule from "../PaginationModule";
import SortReviewModule from "../../functions/SortReviewsModle"; // Import nowego komponentu

const ReviewsPage = () => {
  const movieId = "2c5a8270-9cc9-4ed0-9aa5-40dcec6a7ab1"; // Stałe ID dla testów
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

  useEffect(() => {
    const fetchReviewsByMovieId = async (page: number, pageS: number, sortOrder: string, sortDirection: string) => {
      try {
        const response: AxiosResponse<{
          data: { $values: Review[] };
          totalItems: number;
          pageNumber: number;
          pageSize: number;
          totalPages: number;
        }> = await axios.get(
          `https://localhost:7053/api/Reviews/by-movie-id/${movieId}`,
          {
            params: {
              pageNumber: page,
              pageSize: pageS,
              orderBy: sortOrder,
              sortDirection: sortDirection,
            },
          }
        );
        const { data, totalItems, pageNumber, pageSize, totalPages } = response.data;
        setReviews(data.$values);
        setPagination({ totalItems, pageNumber, pageSize, totalPages });
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          setError(err.response ? `${err.response.status} - ${err.response.statusText}` : "Błąd sieci.");
        } else {
          setError("Nieoczekiwany błąd.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReviewsByMovieId(pagination.pageNumber, pagination.pageSize, sortOrder, sortDirection);
  }, [pagination.pageNumber, pagination.pageSize, sortOrder, sortDirection]);

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
        Recenzje filmu: {reviews[0]?.movieTitle}
      </h2>

      {/* Komponent sortowania */}
      <SortReviewModule onSort={handleSortChange} />

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
              <small>{review?.date ? new Date(review.date).toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" }) : "Brak danych"}</small>
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
        onPageChange={(page) => setPagination((prev) => ({ ...prev, pageNumber: page }))}
      />
    </div>
  );
};

export default ReviewsPage;

