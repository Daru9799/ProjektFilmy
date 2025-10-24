import { useState } from "react";
import { UserProfile } from "../../models/UserProfile";
import { userRole } from "../../models/UserProfile";
import { Button, Form, Modal } from "react-bootstrap";
import { useChangeUserRole } from "../../API/UserApi";
import ActionPendingModal from "../SharedModals/ActionPendingModal";
import { toast } from "react-toastify";
import { getApiError } from "../../functions/getApiError";

interface Props {
  show: boolean;
  onClose: () => void;
  userData: UserProfile;
}

const ChangeRoleModal = ({ show, onClose, userData }: Props) => {
  const [role, setRole] = useState(userData.userRole);
  const roleOptions = Object.entries(userRole).filter(
    ([key, value]) => typeof value === "number"
  ) as [string, number][];

  const { mutate: changeUserRole, isPending: changingUserRole } = useChangeUserRole();

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    changeUserRole({ userId: userData.id, newRole: role.toString() },
      {
        onSuccess: () => {
          onClose();
          toast.success("Rola użytkownika została zmieniona pomyślnie!");
        },
        onError: (err) => {
          const apiErr = getApiError(err);
          toast.error(`Nie udało się zmienić roli użytkownika. [${apiErr?.statusCode}] ${apiErr?.message}`
          );
        },
      }
    );
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

        <ActionPendingModal show={changingUserRole} message="Trwa zapisywanie zmian..."/>
      </Modal.Body>
    </Modal>
  );
};

export default ChangeRoleModal;
