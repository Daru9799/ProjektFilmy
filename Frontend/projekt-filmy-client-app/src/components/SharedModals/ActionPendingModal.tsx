import Modal from "react-bootstrap/Modal";
import SpinnerLoader from "../SpinnerLoader";

const ActionPendingModal = ({ show, message }: { show: boolean; message?: string }) => {
  return (
    <Modal show={show} centered backdrop="static" keyboard={false}>
      <Modal.Body className="text-center">
        <SpinnerLoader />
        <p style={{ marginTop: "1rem" }}>{message ?? "Trwa operacja..."}</p>
      </Modal.Body>
    </Modal>
  );
};

export default ActionPendingModal;