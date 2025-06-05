import { UserRelation } from "../../models/UserRelation";
import { Link } from "react-router-dom";
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

interface FriendCardProps {
  friend: UserRelation;
  onDelete: (relationId: string) => void;
}

const FriendCard = ({ friend, onDelete }: FriendCardProps) => {

  const [showModal, setShowModal] = useState(false);
  
  const handleDelete = () => {
    setShowModal(true);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
  };

  const handleConfirmDelete = () => {
    onDelete(friend.relationId);
    setShowModal(false);
  };

  return (
    <div className="card mb-3" style={{ maxWidth: "300px", backgroundColor: "white" }}>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title mb-3">{friend.relatedUserName}</h5>
          <Link to={`/user/${friend.relatedUserName}`} className="btn btn-primary mb-2">
            Zobacz profil
          </Link>
          <button className="btn btn-danger" onClick={handleDelete}>
            Usuń ze znajomych
          </button>
      </div>

      <Modal show={showModal} onHide={handleCancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Potwierdzenie usunięcia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Czy na pewno chcesz usunąć {friend.relatedUserName} ze znajomych?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Anuluj
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Usuń
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FriendCard;