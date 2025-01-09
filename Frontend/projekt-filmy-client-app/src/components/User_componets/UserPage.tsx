import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserProfile, userRole } from "../../models/UserProfile";
import { Review } from "../../models/Review";
import "./UserPage.css"; 
import ReviewCard from "../review_components/ReviewCard";

//Potrzeba do zamiany enuma na normalną postać
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
  const userName = "critic1"; //Na sztywno nazwa użytkownika
  // const { userName } = useParams<{ userName: string }>();
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
        // Pobranie usera z bazy i zapisanie go do obiektu UserProfile
        const response = await axios.get(`https://localhost:7053/api/Users/by-username/${userName}`);
        setUser(response.data);

        // Pobranie jego recenzji
        try {
          const reviewsResponse = await axios.get(`https://localhost:7053/api/Reviews/by-user-id/${response.data.id}`, {
            params: {
              pageNumber: 1,
              pageSize: 3,
              orderBy: "desc",
              sortDirection: "year",
            },
          });
          const { data } = reviewsResponse.data;
          if (data && data.$values) {
            setReviews(data.$values);
          } else {
            setReviews([]);
          }
        } catch (err: any) {
          if (axios.isAxiosError(err)) {
            if (err.response && err.response.status === 404) {
              setReviews([]); //Brak recenzji przy 404
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
        {/* Potem tu bedzie weryfikacja czy userId albo username zgadza sie z tym zalogowanym jesli tak to bedzie pokazywalo ten przycisk jesli nie to nie */}
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
        <p className="info-label" >Wystawiłeś:</p>
        <div className="info-value">
          <span>{user?.reviewsCount} recenzji</span>
        </div>
      </div>

{/* Sekcja recenzji */}
<div className="pt-3">
  <h3>Ostatnie recenzje:</h3>
  {reviews.length > 0 ? (
    reviews.map((review) => (
      <ReviewCard
        key={review.reviewId}
        review={review}
      />
    ))
  ) : (
    <p>Użytkownik nie dodał jeszcze żadnych recenzji</p>
  )}
</div>
    </>
  );
};

export default UserPage;
