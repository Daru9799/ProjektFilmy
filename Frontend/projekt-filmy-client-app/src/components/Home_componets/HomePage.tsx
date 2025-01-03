import React, { ReactNode } from "react";


const HomePage = () => {

  return (
    <div className="vh-100">
      <div
        style={{
          backgroundImage: "url('/imgs/cinema-background.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "400px",
          width: "100%",
        }}
        className="d-flex justify-content-center align-items-center"
      ></div>
      <div className="bg-dark container-sm text-white py-3">
        <h1>WEBFILM</h1>
        <p>Witaj na stronie dzięki której będziesz mógł znaleść filmy do obejrzenia,
           wystawić im potem recenzje i sprawdzić recenzje innych użytkowników.</p>
      </div>
    </div>
  );
};

export default HomePage;
