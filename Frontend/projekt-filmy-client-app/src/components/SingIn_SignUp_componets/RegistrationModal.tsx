import { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import GoogleLoginButton from "./GoogleLoginButton";
import { useRegister } from "../../API/AccountApi";

interface Props {
  show: boolean; // Czy modal jest widoczny
  onClose: () => void; // Funkcja zamykająca modal
  onRegisterSuccess: (username: string) => void;
}

const RegistrationModal = ({ show, onClose, onRegisterSuccess }: Props) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [googleError, setGoogleErrorMessage] = useState("");

  //Api hook
  const { mutate: register, isPending: registerLoading, apiError: registerError } = useRegister();

  const handleRegister = (e: any) => {
    e.preventDefault();
    register({ email, username, password }, {
      onSuccess: (data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("logged_username", data.userName);
        onRegisterSuccess(data.userName);
        onClose();
        setEmail("");
        setUsername("");
        setPassword("");
      }
    });
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Rejestracja</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {registerLoading && (
          <Alert variant="info" className="mb-3 text-center">
            Trwa logowanie...
          </Alert>
        )}        
        {registerError && (
          <Alert variant="danger" className="mb-3 text-center">
            {registerError?.message}
          </Alert>
        )}
        {googleError && (
          <Alert variant="danger" className="mb-3 text-center">
            {googleError}
          </Alert>
        )}
        <Form onSubmit={handleRegister}>
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
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Hasło</Form.Label>
            <Form.Control
              type="password"
              placeholder="Wprowadź hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Zarejestruj się
          </Button>
        </Form>
        <div className="text-center mt-3">lub</div>
        <div className="d-flex justify-content-center mt-1">
          <GoogleLoginButton onLoginSuccess={onRegisterSuccess} onError={(msg) => setGoogleErrorMessage(msg)} onClose={onClose}/>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RegistrationModal;
