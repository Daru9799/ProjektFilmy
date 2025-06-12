import { UserRelation } from "../../models/UserRelation";
import { useState } from 'react';
import ConfirmationModal from "../SharedModals/ConfirmationModal";

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
      <ConfirmationModal
        show={showModal}
        onCancel={handleCancel}
        onConfirm={handleConfirmUnblock}
        title="Potwierdzenie odblokowania"
        message={`Czy na pewno chcesz odblokować użytkownika ${blockedUser.relatedUserName}?`}
        confirmButtonText="Odblokuj"
        confirmButtonVariant="warning"
      />
    </div>
  );
};

export default BlockedCard;