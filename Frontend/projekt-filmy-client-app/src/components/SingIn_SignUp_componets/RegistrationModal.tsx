import axios from "axios";
import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import GoogleLoginButton from "./GoogleLoginButton";

interface Props {
  show: boolean; // Czy modal jest widoczny
  onClose: () => void; // Funkcja zamykająca modal
  onRegisterSuccess: (username: string) => void;
}

const RegistrationModal = ({ show, onClose, onRegisterSuccess }: Props) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(""); // Resetuj błąd przed próbą rejestracji

    const dataToSend = {
      email: email,
      userName: username,
      password: password,
    };

    try {
      const response = await axios.post(
        "https://localhost:7053/api/Account/register",
        dataToSend
      );

      console.log("Registration successful:", response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("logged_username", response.data.userName);

      onRegisterSuccess(response.data.userName);

      onClose();

      setEmail("");
      setPassword("");
      setUsername("");
    } catch (error: any) {
      console.error("Registration failed:", error);

      // Obsługa różnych błędów na podstawie odpowiedzi z serwera
      if (error.response?.status === 400) {
        const responseData = error.response.data;
        const serverError = error.response?.data;

        if (typeof responseData === "string") {
          setErrorMessage(responseData);
        }
        else if (serverError?.errors) {
          // Wyodrębnienie błędów z obiektu `errors`
          const errorsArray = Object.entries(serverError.errors)
            .filter(([key]) => key !== "$id") // Ignoruj pola jak `$id`
            .flatMap(([_, messages]) => messages) // Pobierz komunikaty błędów
            .join(" "); // Połącz je w jeden ciąg znaków
          setErrorMessage(errorsArray);
        } else {
          setErrorMessage(
            "Wystąpił problem."
          );
        }
      } 
      else {
        setErrorMessage(
          "Wystąpił problem z połączeniem. Spróbuj ponownie później."
        );
      }
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Rejestracja</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && (
          <Alert variant="danger" className="mb-3">
            {errorMessage}
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
          <GoogleLoginButton onLoginSuccess={onRegisterSuccess} onError={(msg) => setErrorMessage(msg)} onClose={onClose}/>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RegistrationModal;
