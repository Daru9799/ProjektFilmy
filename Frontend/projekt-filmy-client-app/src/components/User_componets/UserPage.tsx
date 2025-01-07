import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User } from "../../models/User";
import { Review } from "../../models/Review";
import "./UserPage.css"; // Import pliku CSS
import { renderStars } from "../../functions/starFunction";

const UserPage = () => {
  const userId = "";
  // const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
    const [reviews, setReviews] = useState<Review[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const [userResponse, reviewsResponse] = await Promise.all([
          axios.get("https://localhost:7053/api/account/login"),
          axios.get(`https://localhost:7053/api/Reviews/by-user-id/${userId}`, {
            params: {
              pageNumber: 1,
              pageSize: 2,
            },
          }),
        ]);

      const { data, totalItems, pageNumber, pageSize, totalPages } = reviewsResponse.data;

        setUser(userResponse.data);
        setReviews(data.$values); 

      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          if (!err.response) {
            setError("Błąd sieci: nie można połączyć się z serwerem.");
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
    fetchUserById();
  }, [userId]);

  return (
    <>
      <div className="header">
        <p className="user-name">Jacek Gula</p>
        <button className="edit-button">Edytuj</button>
      </div>

      <div className="info-row">
        <p className="info-label">Email:</p>
        <div className="info-value">
          <span>wspolny@ogarnij.se</span>
        </div>
      </div>

      <div className="info-row">
        <p className="info-label">Telefon:</p>
        <div className="info-value">
          <span>888 444 777</span>
        </div>
      </div>

      <div className="info-row">
        <p className="info-label" >Jesteś z nami:</p>
        <div className="info-value">
          <span>12 dni</span>
        </div>
      </div>


{/* Sekcja recenzji */}
<div className="pt-3">
  <h3>Twoje recenzje:</h3>
  {reviews.length > 0 ? (
    reviews.map((review) => (
      <div
        key={review.reviewId} 
        className="d-flex justify-content-between align-items-start p-3 my-2 mx-auto"
        style={{
          backgroundColor: "white",
          borderRadius: "15px",  // Zaokrąglenie krawędzi
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Delikatny cień
          padding: "20px",
          color: "black",
          width: "95%",
        }}
      >
        <div style={{ flex: 1, textAlign: "left" }}>
          <p style={{ fontWeight: "bold" }}>{review.username}</p>
          <p>{review.comment}</p>
        </div>
        <div style={{ textAlign: "right", color: "black" }}>
          {renderStars(review.rating)}
          <h4>{review.rating}/5</h4>
          <small>{review?.date ? new Date(review.date).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' }) : "Brak danych"}</small>
        </div>
      </div>
    ))
  ) : (
    <p>Nie masz jescze recenzji</p>
  )}
</div>

    </>
  );
};

export default UserPage;
