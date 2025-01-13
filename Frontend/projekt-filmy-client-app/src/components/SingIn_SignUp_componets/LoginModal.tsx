import axios from "axios";
import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

interface Props {
  show: boolean;
  onClose: () => void;
  onLoginSuccess: (username: string) => void; // Funkcja do przekazania nazwy użytkownika
}

const LoginModal = ({ show, onClose, onLoginSuccess }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataToSend = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post("https://localhost:7053/api/Account/login", dataToSend);

      console.log("Login successful:", response.data);
      localStorage.setItem("logged_username", response.data.userName);
      localStorage.setItem("token", response.data.token);

      // Wywołaj funkcję, aby przekazać nazwę użytkownika do NavBar
      onLoginSuccess(response.data.userName);

      onClose();

      setEmail("");
      setPassword("");
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error.response?.status === 401) {
        setErrorMessage("Podałeś błędny e-mail lub hasło");
      } else {
        setErrorMessage(error.response?.data?.message || "Wystąpił problem podczas logowania.");
      }
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Logowanie</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && (
          <Alert variant="danger" className="mb-3">
            {errorMessage}
          </Alert>
        )}
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Adres e-mail</Form.Label>
            <Form.Control type="email" placeholder="Wprowadź e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Hasło</Form.Label>
            <Form.Control type="password" placeholder="Wprowadź hasło" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Zaloguj się
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
