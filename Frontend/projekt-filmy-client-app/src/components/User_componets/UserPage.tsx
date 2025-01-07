import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User } from "../../models/User";
import { Review } from "../../models/Review";
import "./UserPage.css"; 
import ReviewCard from "../review_components/ReviewCard";

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
  <h3>Recenzje:</h3>
  {reviews.length > 0 ? (
    reviews.map((review) => (
      <ReviewCard
        key={review.reviewId}
        review={review}
      />
    ))
  ) : (
    <p>Nie dodałeś jeszcze recenzji</p>
  )}
</div>
    </>
  );
};

export default UserPage;
