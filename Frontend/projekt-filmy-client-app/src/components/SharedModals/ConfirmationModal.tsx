import { Modal, Button } from 'react-bootstrap';

interface ConfirmationModalProps {
  show: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText: string;
  confirmButtonVariant?: string;
  cancelButtonText?: string;
}

const ConfirmationModal = ({
  show,
  onCancel,
  onConfirm,
  title,
  message,
  confirmButtonText,
  confirmButtonVariant = 'primary',
  cancelButtonText = 'Anuluj',
}: ConfirmationModalProps) => {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          {cancelButtonText}
        </Button>
        <Button variant={confirmButtonVariant} onClick={onConfirm}>
          {confirmButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;