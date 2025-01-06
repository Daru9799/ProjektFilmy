import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Actor } from '../../models/Actor';
import { Modal } from "react-bootstrap";

const ActorPage = () => {

  const actorId = "4522039a-2e36-431e-a6ed-5fdfd041cccc";
  // const { actorId } = useParams<{ movieId: string }>();
  const [actor, setActor] = useState<Actor | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActorById = async () => {
      try {
        const actorResponse = await axios.get(`https://localhost:7053/api/Actors/${actorId}`);
        setActor(actorResponse.data);
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

    fetchActorById();
  }, [actorId]);

  const handleImageClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (loading) return <p>Ładowanie danych...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="vh-100 container-fluid text-white" style={{ left: "200px", }}>
      <div className="row my-4">
        {/* Left Column (Poster) */}
        <div className="col-3">
          <div className="p-2 text-center">
            <img
              src={actor?.photoUrl || "/path/to/defaultPoster.jpg"}
              alt="Poster"
              className="img-fluid"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
                marginTop: "10%",
                marginLeft: "10%",
                cursor: "pointer", // Cursor pointer for click indication
              }}
              onClick={handleImageClick}
            />
          </div>
        </div>

        {/* Modal for enlarged image */}
        <Modal show={showModal} onHide={closeModal} centered>
          <Modal.Body className="p-0">
            <img
              src={actor?.photoUrl || "/path/to/defaultPoster.jpg"}
              alt="Enlarged Poster"
              className="img-fluid"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            <button className="btn btn-secondary" onClick={closeModal}>
              Zamknij
            </button>
          </Modal.Footer>
        </Modal>

        {/* Middle Column (Details) */}
        <div className="col-8" style={{ textAlign: "left", marginLeft: "50px", marginTop: "20px" }}>
          {/* Title (Actor's Name) */}
          <h2 className="mb-3" style={{ fontSize: "4rem"}}>
            {actor?.firstName && actor?.lastName ? `${actor.firstName} ${actor.lastName}` : "Imię i nazwisko niedostępne"}
          </h2>

          {/* Data urodzenia */}
          <p style={{marginTop:"50px"}}>
            <span className="fw-bold">Data urodzenia: </span>
            {actor?.birthDate ? new Date(actor.birthDate).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' }) : "Brak danych"}
          </p>

          {/* Biografia */}
          <div
            className="bg-white p-3 shadow-sm"
            style={{
              fontSize: "1.1rem",
              minHeight: "140px",
              borderRadius: "20px",
              textAlign: "left",
              marginTop: "20px",
              marginRight: "50px"
            }}
          >
            <p className="text-dark">{actor?.bio || "Brak danych o biografii."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActorPage;
