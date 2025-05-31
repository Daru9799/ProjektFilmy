import axios from "axios";
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";


interface PasswordProps {
    show: boolean;
    onClose: () => void;
  }
  
  const ChangePasswordModal = ({ show, onClose }: PasswordProps) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
    const handleSavePassword = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      if (newPassword !== confirmPassword) {
        setErrorMessage("Nowe hasła muszą być identyczne!");
        return;
      }
  
      try {
        const response = await axios.patch(
          "https://localhost:7053/api/Account/change-password",
          {
            currentPassword,
            newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
  
        if (response.status === 200) {
          alert("Hasło zostało zmienione!");
          setErrorMessage(null);
          onClose();
        }
      } catch (error: any) {
        if (error.response && error.response.data) {
          const serverError = error.response.data;

          if (typeof serverError === "string") {
            setErrorMessage(serverError);
          } else if (serverError?.errors) {
            const errorsArray = Object.entries(serverError.errors)
              .filter(([key]) => key !== "$id") 
              .flatMap(([_, messages]) => Array.isArray(messages) ? messages : [])
              .join(" "); 
            setErrorMessage(errorsArray);
          } else {
            setErrorMessage("Wystąpił problem podczas zmiany hasła!");
          }
        } else {
          setErrorMessage("Wystąpił problem z połączeniem. Spróbuj ponownie później.");
        }
      }
    };
  
    return (
      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Zmień hasło</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
  