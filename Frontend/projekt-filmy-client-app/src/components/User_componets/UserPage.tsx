import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { UserProfile, userRole } from "../../models/UserProfile";
import { Review } from "../../models/Review";
import "./UserPage.css"; 
import ReviewCard from "../review_components/ReviewCard";

// Zamiana enuma na nazwę roli użytkownika
function getUserRoleName(role: userRole): string {
  switch (role) {
    case userRole.user:
      return "Normalny użytkownik";
    case userRole.critic:
      return "Krytyk";
    case userRole.mod:
      return "Moderator";
    default:
      return "Nieznany";
  }
}

const UserPage = () => {
  //const userName = "critic1"; // Sztywna nazwa użytkownika
  const { userName } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);

        // Pobranie danych użytkownika
        const response = await axios.get(
          `https://localhost:7053/api/Users/by-username/${userName}`
        );
        setUser(response.data);

        // Pobranie recenzji użytkownika
        try {
          const reviewsResponse = await axios.get(
            `https://localhost:7053/api/Reviews/by-username/${userName}`,
            {
              params: {
                pageNumber: 1,
                pageSize: 3,
                orderBy: "desc",
                sortDirection: "year",
              },
            }
          );

          const { data } = reviewsResponse.data;
          if (data && data.$values) {
            setReviews(data.$values);
          } else {
            setReviews([]);
          }
        } catch (err: any) {
          if (axios.isAxiosError(err)) {
            if (err.response && err.response.status === 404) {
              setReviews([]); // Brak recenzji
            } else {
              setError("Wystąpił błąd podczas pobierania recenzji.");
            }
          }
        }
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          if (!err.response) {
            setError("Błąd sieci: nie można połączyć się z serwerem.");
          } else if (err.response.status === 404) {
            setError(`Użytkownik o nazwie '${userName}' nie został znaleziony.`);
          } else {
            setError(`Błąd: ${err.response.status} - ${err.response.statusText}`);
          }
        } else {
          setError("Wystąpił nieoczekiwany błąd.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userName]);

  if (loading) return <p>Ładowanie danych...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <div className="header">
        <p className="user-name">{user?.userName}</p>
        {/* Przycisk edycji, jeśli zalogowany użytkownik to właściciel konta */}
        <button className="edit-button">Edytuj</button>
      </div>

      <div className="info-row">
        <p className="info-label">Email:</p>
        <div className="info-value">
          <span>{user?.email}</span>
        </div>
      </div>

      <div className="info-row">
        <p className="info-label">Rola:</p>
        <div className="info-value">
          <span>{user && getUserRoleName(user.userRole)}</span>
        </div>
      </div>

      <div className="info-row">
        <p className="info-label">Ilość recenzji:</p>
        <div className="info-value">
          <span>{user?.reviewsCount}</span>
        </div>
      </div>

      <div className="pt-3">
        <h3 style={{ color: "white" }}>Ostatnie recenzje:</h3>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard
              key={review.reviewId}
              review={review}
              showMovieTitle={true}
            />
          ))
        ) : (
          <p>Użytkownik nie dodał jeszcze żadnych recenzji</p>
        )}

        {/* Przycisk do wyświetlenia większej liczby recenzji */}
        {(user?.reviewsCount ?? 0) > 3 && (
          <button
            className="review-btn"
            onClick={() => navigate(`/user/${userName}/reviews`)}
          >
            ...
          </button>
        )}
      </div>
    </>
  );
};

export default UserPage;