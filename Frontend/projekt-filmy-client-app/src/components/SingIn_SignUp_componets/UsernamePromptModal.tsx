import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface Props {
  show: boolean;
  onClose: () => void;
  onSubmit: (username: string) => void;
}

const UsernamePromptModal = ({ show, onClose, onSubmit }: Props) => {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSubmit(username.trim());
      setUsername("");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
    <Modal.Dialog style={{ color: "black", borderRadius: "8px"}}>
      <Modal.Header closeButton>
        <Modal.Title>Podaj nazwę użytkownika</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Nazwa użytkownika</Form.Label>
            <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} required/>
          </Form.Group>
          <Button variant="success" type="submit" className="mt-3 w-100">
            Zatwierdź
          </Button>
        </Form>
      </Modal.Body>
    </Modal.Dialog>
    </Modal>
  );
};

export default UsernamePromptModal;