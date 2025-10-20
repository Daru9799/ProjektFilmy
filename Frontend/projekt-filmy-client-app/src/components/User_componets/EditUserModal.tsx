import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { UserProfile } from "../../models/UserProfile";
import ChangePasswordModal from "./EditUserPassword";
import { useNavigate } from "react-router-dom";
import InfoModal from "../SharedModals/InfoModal"
import { useEditUser } from "../../API/AccountApi";

interface Props {
  show: boolean;
  onClose: () => void;
  userData: UserProfile;
  onSave: (updatedUser: UserProfile) => void;
}

const EditUserModal = ({ show, onClose, userData, onSave }: Props) => {
  const [email, setEmail] = useState(userData.email);
  const [username, setUsername] = useState(userData.userName);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showGoogleInfoModal, setShowGoogleInfoModal] = useState(false);
  const navigate = useNavigate();

  //Api hook
  const { mutate: editUser, isPending: saving, apiError: savingError } = useEditUser();

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editUser({ userName: username, email }, {
      onSuccess: (updatedUser) => {
        localStorage.setItem("logged_username", username);

        const event = new CustomEvent("userUpdated", {
          detail: { username: username },
        });
        
        window.dispatchEvent(event);
        navigate(`/user/${username}`);
        onSave(updatedUser);
      }
    });
  };

  return (
    <>
      {/* Modal do edycji danych użytkownika */}
      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edytuj dane użytkownika</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {saving && (
            <Alert variant="info" className="mb-3 text-center">
              Trwa zapisywanie zmian...
            </Alert>
          )}
          {savingError && (
            <Alert variant="danger" className="mb-3 text-center">
              {savingError?.message}
            </Alert>
          )}
          <Form onSubmit={handleSave}>
            {/* Pole edycji email */}
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Adres e-mail</Form.Label>
              <Form.Control type="email" placeholder="Wprowadź e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={userData.isGoogleUser}/>
              {userData.isGoogleUser && (
                <Form.Text className="text-muted">
                  Adres e-mail jest powiązany z kontem Google i nie może być zmieniony.
                </Form.Text>
              )}
            </Form.Group>

            {/* Pole edycji nazwy użytkownika */}
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Nazwa użytkownika</Form.Label>
              <Form.Control type="text" placeholder="Wprowadź nazwę użytkownika" value={username} onChange={(e) => setUsername(e.target.value)} required/>
            </Form.Group>

            {/* Przycisk zapisu */}
            <Button variant="primary" type="submit" className="w-100">
              Zapisz zmiany
            </Button>
          </Form>

          {/* Przycisk edytowania hasła */}
          <Button
            variant="outline-secondary"
            className="mt-3 w-100"
            onClick={() => {
              if (userData.isGoogleUser) {
                setShowGoogleInfoModal(true);
                return
              }
              console.log("tutaj" + userData.isGoogleUser)
              setShowPasswordModal(true);
            }}
          >
            Edytuj hasło
          </Button>
        </Modal.Body>
      </Modal>
      
      {/* Modal informujący o koncie google gdy chcemy mu zmienić hasło */}
      <InfoModal show={showGoogleInfoModal} onClose={() => setShowGoogleInfoModal(false)} title="Informacja" message="To konto zostało utworzone przez logowanie Google OAuth i nie obsługuje zmiany hasła." variant="danger"/>
      {/* Modal do zmiany hasła */}
      <ChangePasswordModal show={showPasswordModal} onClose={() => setShowPasswordModal(false)}/>
    </>
  );
};

export default EditUserModal;