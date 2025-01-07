import React, { useState } from "react";
import { Modal } from "react-bootstrap";

interface ImageModalProps {
    imageUrl?: string; 
    altText?: string;
    defaultImageUrl?: string;
  }
  

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, altText = "Image", defaultImageUrl = "/path/to/defaultPoster.jpg" }) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleImageClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* Thumbnail Image */}
      <img
        src={imageUrl || defaultImageUrl}
        alt={altText}
        className="img-fluid"
        style={{
          width: "100%",
          height: "auto",
          objectFit: "cover",
          cursor: "pointer",
        }}
        onClick={handleImageClick}
      />

      {/* Modal for Enlarged Image */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Body className="p-0">
          <img
            src={imageUrl || defaultImageUrl}
            alt={`Enlarged ${altText}`}
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
    </>
  );
};

export default ImageModal;







