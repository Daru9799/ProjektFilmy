import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {User} from '../../models/User';


const UserPage = () => {

  const userId="";
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const response = await axios.get('https://localhost:7053/api/account/login');
      
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
      {/* Kontener Flexbox dla nazwy użytkownika i przycisku */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "80px",
          backgroundColor: "black"
        }}
      >
        {/* Nazwa użytkownika */}
        <p
          style={{
            fontSize: "3rem",
            color: "white",
            marginLeft: "80px",
            marginTop: "50px",
          }}
        >
          Jacek Gula
        </p>
  
        {/* Przycisk Edytuj */}
        <button
          style={{
            fontSize: "1rem",
            padding: "10px 20px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            marginRight: "50px",
            cursor: "pointer",
            marginTop: "50px",
          }}
        >
          Edytuj
        </button>
      </div>
  
      {/* Responsywne pola */}
      <p style={{ color: "white", marginTop: "50px", marginBottom: "-1px" }}>Email</p>
      <div
        className="bg-white p-3 shadow-sm"
        style={{
          fontSize: "1.1rem",
          minHeight: "30px",
          borderRadius: "20px",
          textAlign: "center",
          margin: "0 auto", // Wyśrodkowanie
          width: "20%", // Szerokość 20% ekranu
          marginBottom: "20px",
        }}
      >
        <span style={{ color: "black" }}>wspolny@ogarnij.se</span>
      </div>
  
      <p style={{ color: "white", marginTop: "20px", marginBottom: "-1px" }}>Telefon</p>
      <div
        className="bg-white p-3 shadow-sm"
        style={{
          fontSize: "1.1rem",
          minHeight: "30px",
          borderRadius: "20px",
          textAlign: "center",
          margin: "0 auto",
          width: "20%", // Szerokość 20% ekranu
        }}
      >
        <span style={{ color: "black" }}>888 444 777</span>
      </div>
  
      <p style={{ color: "white", marginTop: "20px", marginBottom: "-1px" }}>Jesteś z nami</p>
      <div
        className="bg-white p-3 shadow-sm"
        style={{
          fontSize: "1rem",
          minHeight: "30px",
          borderRadius: "20px",
          textAlign: "center",
          margin: "0 auto",
          width: "20%", // Szerokość 20% ekranu
        }}
      >
        <span style={{ color: "black" }}>12 dni</span>
      </div>



    <div style={{
          alignItems: "center", marginTop:"60px"}}>
        <p style={{textAlign:"center", color:"white", fontSize:'2rem'}}>Recnezje:</p>





    </div>

    </>
  );
};

export default UserPage;
