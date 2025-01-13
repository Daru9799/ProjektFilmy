import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { UserProfile } from "../../models/UserProfile";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Props {
  show: boolean;
  onClose: () => void;
  userData: UserProfile;
  onSave: (updatedUser: UserProfile, passwords?: { currentPassword: string; newPassword: string }) => void;
}

const EditUserModal = ({ show, onClose, userData, onSave }: Props) => {
  const [email, setEmail] = useState(userData.email);
  const [username, setUsername] = useState(userData.userName);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const navigate = useNavigate();

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Sprawdzenie, czy hasła się zgadzają
    if (newPassword && newPassword !== confirmPassword) {
      alert("Nowe hasła muszą być identyczne!");
      return;
    }

    const updatedUser: UserProfile = {
      ...userData,
      email,
      userName: username,
    };

    try {
      // Wykonanie zapytania do backendu (np. do API, aby zaktualizować dane użytkownika)
      const response = await axios.patch('https://localhost:7053/api/Account/edit', {
        NewLogin: updatedUser.userName,
        NewEmail: updatedUser.email,
        //currentPassword,
        //newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Jeżeli dane użytkownika zostały pomyślnie zapisane, wywołaj onSave
      if (response.status === 200) {
        alert('Dane zostały zapisane!');
        localStorage.setItem("logged_username", updatedUser.userName);

        // Możesz przekazać dane użytkownika do funkcji onSave
        onSave(updatedUser, { currentPassword, newPassword });
        navigate(`/user/${updatedUser.userName}`);
      }
    } catch (error) {
      console.error("Błąd przy zapisywaniu danych użytkownika:", error);
      alert('Wystąpił problem podczas zapisywania danych!');
    }
  };

  const handleClose = () => {
    // Resetuj stan po zamknięciu modalu
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswords(false);
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
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

          {/* Pole aktualnego hasła */}
          <Form.Group className="mb-3" controlId="currentPassword">
            <Form.Label>Aktualne hasło</Form.Label>
            <div className="password-field">
              <Form.Control
                type={showPasswords ? "text" : "password"}
                placeholder="Podaj aktualne hasło"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
          </Form.Group>

          {/* Pole nowego hasła */}
          <Form.Group className="mb-3" controlId="newPassword">
            <Form.Label>Nowe hasło</Form.Label>
            <div className="password-field">
              <Form.Control
                type={showPasswords ? "text" : "password"}
                placeholder="Wprowadź nowe hasło"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </Form.Group>

          {/* Potwierdzenie nowego hasła */}
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Potwierdź nowe hasło</Form.Label>
            <Form.Control
              type="password"
              placeholder="Potwierdź nowe hasło"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          {/* Przycisk do pokazania/ukrycia haseł */}
          <Button
            variant="outline-secondary"
            className="show-passwords-btn mb-3"
            onClick={() => setShowPasswords(!showPasswords)}
          >
            <i className={`fas ${showPasswords ? "fa-eye-slash" : "fa-eye"}`} />{" "}
            {showPasswords ? "Ukryj hasła" : "Pokaż hasła"}
          </Button>

          {/* Przycisk zapisu */}
          <Button variant="primary" type="submit" className="w-100">
            Zapisz zmiany
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditUserModal;