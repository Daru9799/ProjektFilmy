import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import GoogleLoginButton from "./GoogleLoginButton";
import { useLogin } from "../../API/AccountApi";

interface Props {
  show: boolean;
  onClose: () => void;
  onLoginSuccess: (username: string) => void; // Funkcja do przekazania nazwy użytkownika
}

const LoginModal = ({ show, onClose, onLoginSuccess }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorTemp, setErrorMessage] = useState(""); //Temp

  //Api hook
  const { mutate: login, isPending: loginLoading, apiError: loginError } = useLogin();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ email, password }, {
        onSuccess: (data) => {
          localStorage.setItem("logged_username", data.userName);
          localStorage.setItem("token", data.token);
          onLoginSuccess(data.userName);
          onClose();
          setEmail("");
          setPassword("");
        }
      }
    );
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Logowanie</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loginLoading && (
          <Alert variant="info" className="mb-3 text-center">
            Trwa logowanie...
          </Alert>
        )}
        {loginError && (
          <Alert variant="danger" className="mb-3 text-center">
            {loginError?.message}
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
          <div className="text-center mt-3">lub</div>
          <div className="d-flex justify-content-center mt-1">
            <GoogleLoginButton onLoginSuccess={onLoginSuccess} onError={(msg) => setErrorMessage(msg)} onClose={onClose}/>
          </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
