import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User } from "../../models/User";
import "./UserPage.css"; // Import pliku CSS


const UserPage = () => {
  const userId = "";
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const response = await axios.get("https://localhost:7053/api/account/login");
        setUser(response.data);
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

      <div className="reviews">
        <p className="reviews-title">Recenzje:</p>
      </div>
    </>
  );
};

export default UserPage;
