import { useState } from "react";
import { UserProfile } from "../../models/UserProfile";
import { userRole } from "../../models/UserProfile";
import { Button, Form, Modal } from "react-bootstrap";
import { changeRole } from "../../API/userAPI";

interface Props {
  show: boolean;
  onClose: () => void;
  userData: UserProfile;
  onSave: (updatedUser: UserProfile) => void;
}

const ChangeRoleModal = ({ show, onClose, userData, onSave }: Props) => {
  const [role, setRole] = useState(userData.userRole);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const roleOptions = Object.entries(userRole).filter(
    ([key, value]) => typeof value === "number"
  ) as [string, number][];

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const data = await changeRole(userData.id, userRole[role]);
      console.log("ODPOWIEDZ: ", data);
      const updatedUser = { ...userData, userRole: role };
      onSave(updatedUser);
      onClose();
    } catch (error: any) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("Wystąpił błąd podczas zmiany roli!");
      }
    }
  };
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Zmień rolę użytkownika</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSave}>
          <Form.Group controlId="roleRadios" className="mb-3">
            <Form.Label className="d-flex justify-content-center">
              Wybierz rolę
            </Form.Label>
            <div className="d-flex gap-3 justify-content-center">
              {roleOptions.map(([roleName, roleValue]) => (
                <Form.Check
                  key={roleValue}
                  type="radio"
                  name="role"
                  label={roleName}
                  value={roleValue}
                  checked={role === roleValue}
                  onChange={(e) => {
                    setRole(Number(e.target.value));
                  }}
                />
              ))}
            </div>
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Zapisz zmiany
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ChangeRoleModal;
