import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { UserProfile } from "../../models/UserProfile";
import axios from "axios";
import ChangePasswordModal from "./EditUserPassword";
import { useNavigate } from "react-router-dom";

interface Props {
  show: boolean;
  onClose: () => void;
  userData: UserProfile;
  onSave: (updatedUser: UserProfile) => void;
}

const EditUserModal = ({ show, onClose, userData, onSave }: Props) => {
  const [email, setEmail] = useState(userData.email);
  const [username, setUsername] = useState(userData.userName);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const navigate = useNavigate();

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedUser: UserProfile = {
      ...userData,
      email,
      userName: username,
    };

    try {
      const response = await axios.patch(
        "https://localhost:7053/api/Account/edit",
        {
          NewLogin: updatedUser.userName,
          NewEmail: updatedUser.email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        localStorage.setItem("logged_username", updatedUser.userName);
        localStorage.setItem("logged_username", updatedUser.userName);

        const event = new CustomEvent("userUpdated", {
          detail: { username: updatedUser.userName },
        });
        window.dispatchEvent(event);
        navigate(`/user/${updatedUser.userName}`);
        onSave(updatedUser);
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("Wystąpił problem podczas zapisywania danych!");
      }
    }
  };

  return (
    <>
      {/* Modal do edycji danych użytkownika */}
      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edytuj dane użytkownika</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            {/* Pole edycji email */}
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Adres e-mail</Form.Label>
              <Form.Control
                type="email"
                placeholder="Wprowadź e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            {/* Pole edycji nazwy użytkownika */}
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Nazwa użytkownika</Form.Label>
              <Form.Control
                type="text"
                placeholder="Wprowadź nazwę użytkownika"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            {/* Komunikat o błędzie */}
            {errorMessage && <p className="text-danger">{errorMessage}</p>}

            {/* Przycisk zapisu */}
            <Button variant="primary" type="submit" className="w-100">
              Zapisz zmiany
            </Button>
          </Form>

          {/* Przycisk edytowania hasła */}
          <Button
            variant="outline-secondary"
            className="mt-3 w-100"
            onClick={() => setShowPasswordModal(true)}
          >
            Edytuj hasło
          </Button>
        </Modal.Body>
      </Modal>

      {/* Modal do zmiany hasła */}
      <ChangePasswordModal
        show={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
};

export default EditUserModal;
