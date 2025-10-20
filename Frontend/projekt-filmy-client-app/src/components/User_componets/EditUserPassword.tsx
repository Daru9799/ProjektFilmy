import { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useChangePassword } from "../../API/AccountApi";
import { toast } from "react-toastify";


interface PasswordProps {
    show: boolean;
    onClose: () => void;
  }
  
  const ChangePasswordModal = ({ show, onClose }: PasswordProps) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    //Api hook
    const { mutate: changePassword, isPending: changingPassword, apiError: passwordChangingError } = useChangePassword();
  
    const handleSavePassword = async (e: any) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
        setErrorMessage("Nowe hasła muszą być identyczne!");
        return;
      }
      changePassword({ currentPassword, newPassword }, {
        onSuccess: () => {
          toast.success("Hasło zostało zmienione pomyślnie!");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setErrorMessage(null);
          onClose();
        }
      });
    };
  
    return (
      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Zmień hasło</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {changingPassword && (
            <Alert variant="info" className="mb-3 text-center">
              Trwa zmiana hasła...
            </Alert>
          )}
          {passwordChangingError && (
            <Alert variant="danger" className="mb-3 text-center">
              {passwordChangingError?.message}
            </Alert>
          )}
          <Form onSubmit={handleSavePassword}>
            {/* Pole aktualnego hasła */}
            <Form.Group className="mb-3" controlId="currentPassword">
              <Form.Label>Aktualne hasło</Form.Label>
              <Form.Control
                type="password"
                placeholder="Podaj aktualne hasło"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </Form.Group>
  
            {/* Pole nowego hasła */}
            <Form.Group className="mb-3" controlId="newPassword">
              <Form.Label>Nowe hasło</Form.Label>
              <Form.Control
                type="password"
                placeholder="Wprowadź nowe hasło"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>
  
            {/* Potwierdzenie nowego hasła */}
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Potwierdź nowe hasło</Form.Label>
              <Form.Control
                type="password"
                placeholder="Potwierdź nowe hasło"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
  
            {/* Komunikat o błędzie */}
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
  
            {/* Przycisk zapisu */}
            <Button variant="primary" type="submit" className="w-100">
              Zapisz nowe hasło
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };
  
  export default ChangePasswordModal;
  