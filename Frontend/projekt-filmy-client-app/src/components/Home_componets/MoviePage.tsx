import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const MoviePage = () => {
  return (
    <div className="vh-100 container-fluid">
 
      {/* Main Content */}
 {/* Main Content */}
<div className="row my-4" >
  {/* Left Column (Poster) */}
  <div className="col-2" >
    <div className="border p-2 text-center" >
      <img className="rounded" src="/download.jpg" alt="Poster" />
      <p>Poster</p>
    </div>
  </div>

        {/* Middle Column (Details) */}
        <div className="col-7">
          <h2 className="mb-1">Tytuł</h2>
          <p className="mb-1">
            <span className="fw-bold">Reżyser:</span> Jan Gula
          </p>
          <p className="mb-1">
            <span className="fw-bold">Rok:</span> 2023
          </p>
          <p className="mb-1">
            <span className="fw-bold">Czas:</span> 120 min
          </p>
          <ul className="nav nav-pills my-3">
  <li className="nav-item">
    <button className="nav-link active btn-primary" id="opis-tab" data-bs-toggle="pill" data-bs-target="#opis" type="button">
      Opis
    </button>
  </li>
  <li className="nav-item">
    <button className="nav-link btn-secondary" id="gatunki-tab" data-bs-toggle="pill" data-bs-target="#gatunki" type="button">
      Gatunki
    </button>
  </li>
  <li className="nav-item">
    <button className="nav-link btn-success" id="aktorzy-tab" data-bs-toggle="pill" data-bs-target="#aktorzy" type="button">
      Aktorzy
    </button>
  </li>
  <li className="nav-item">
    <button className="nav-link btn-danger" id="kraje-tab" data-bs-toggle="pill" data-bs-target="#kraje" type="button">
      Kraje
    </button>
  </li>
</ul>


{/* Sekcje odpowiadające za treści zakładek */}
<div className="tab-content">
  <div className="tab-pane fade show active" id="opis">
    <p>
      Setki spłukanych graczy przyjmują dziwne zaproszenie do udziału w grach dla dzieci. Nagroda jest kusząca, ale stawka — przerażająco wysoka.
    </p>
  </div>
  <div className="tab-pane fade" id="gatunki">
    <p>Przykładowe gatunki filmu</p>
  </div>
  <div className="tab-pane fade" id="aktorzy">
    <p>Aktorzy w filmie</p>
  </div>
  <div className="tab-pane fade" id="kraje">
    <p>Kraje, w których film był kręcony</p>
  </div>
</div>
        </div>

        {/* Right Column (Ratings) */}
        <div className="col-3">
          <div className="text-center border p-3">
            <h4>8/10</h4>
            <p className="mb-0">250</p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-top pt-3">
        <h3>Recenzje:</h3>
        <div className="d-flex justify-content-between align-items-start border p-3 my-2">
          <div>
            <p className="fw-bold mb-1">Jacek Ryba</p>
            <p>film nawet faljny, ale pies mi naszczał do buta więc 2/10</p>
          </div>
          <div className="text-center">
            <h4 className="mb-0">2/10</h4>
            <small>20.12.2024</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
