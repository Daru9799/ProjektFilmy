import { UserRelation } from "../../models/UserRelation";
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

interface BlockedCardProps {
  blockedUser: UserRelation;
  onUnblock: (relationId: string) => void;
}

const BlockedCard = ({ blockedUser, onUnblock }: BlockedCardProps) => {
  const [showModal, setShowModal] = useState(false);

  const handleUnblockClick = () => {
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleConfirmUnblock = () => {
    onUnblock(blockedUser.relationId);
    setShowModal(false);
  };

  return (
    <div className="card mb-3" style={{ maxWidth: "300px", backgroundColor: "white" }}>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title mb-3">{blockedUser.relatedUserName}</h5>
        <button className="btn btn-warning" onClick={handleUnblockClick}>
          Odblokuj użytkownika
        </button>
      </div>

      <Modal show={showModal} onHide={handleCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Potwierdzenie odblokowania</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Czy na pewno chcesz odblokować użytkownika {blockedUser.relatedUserName}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Anuluj
          </Button>
          <Button variant="warning" onClick={handleConfirmUnblock}>
            Odblokuj
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BlockedCard;