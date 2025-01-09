import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserProfile, userRole } from "../../models/UserProfile";
import { Review } from "../../models/Review";
import ReviewCard from "../review_components/ReviewCard";
import SortReviewModule from "../review_components/SortReviewsModle"; // Zakładając, że komponent SortReviewModule jest w tym folderze

// Potrzeba do zamiany enuma na normalną postać
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
  const userName = "critic1"; // Na sztywno nazwa użytkownika
  const id = "7d248152-f4fb-4c46-991d-847352577743"; // Na sztywno ID użytkownika
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sortedReviews, setSortedReviews] = useState<Review[]>([]); // Zmienna do posortowanych recenzji
  const [sortOption, setSortOption] = useState<string>("highRaiting"); // Domyślna opcja sortowania
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);

        // Pobranie usera z bazy i zapisanie go do obiektu UserProfile
        const response = await axios.get(
          `https://localhost:7053/api/Users/by-username/${userName}`
        );
        setUser(response.data);

        // Pobranie jego recenzji
        try {
          const reviewsResponse = await axios.get(
            `https://localhost:7053/api/Reviews/by-user-id/${response.data.id}`,
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
            setSortedReviews(data.$values); // Set the initial sortedReviews
          } else {
            setReviews([]);
          }
        } catch (err: any) {
          if (axios.isAxiosError(err)) {
            if (err.response && err.response.status === 404) {
              setReviews([]); // Brak recenzji przy 404
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

  const handleSort = (category: string) => {
    setSortOption(category);

    let sorted: Review[] = [];
    if (category === "highRaiting") {
      sorted = [...reviews].sort((a, b) => b.rating - a.rating); // Sortowanie po najwyższej ocenie
    } else if (category === "lowRaiting") {
      sorted = [...reviews].sort((a, b) => a.rating - b.rating); // Sortowanie po najniższej ocenie
    } else if (category === "new") {
      sorted = [...reviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sortowanie po dacie (najnowsze)
    } else if (category === "old") {
      sorted = [...reviews].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sortowanie po dacie (najstarsze)
    }

    setSortedReviews(sorted); // Ustawienie posortowanych recenzji
  };

  if (loading) return <p>Ładowanie danych...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <div className="header">
        <p className="user-name">{user?.userName}</p>
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

        <SortReviewModule onSort={handleSort} />

        {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => (
            <ReviewCard key={review.reviewId} review={review} showMovieTitle={true} />
          ))
        ) : (
          <p>Użytkownik nie dodał jeszcze żadnych recenzji</p>
        )}

        {(user?.reviewsCount ?? 0) > 3 && (
          <button className="review-btn" onClick={() => navigate(`/userReviews/${id}`)}>
            ...
          </button>
        )}
      </div>
    </>
  );
};

export default UserPage;
