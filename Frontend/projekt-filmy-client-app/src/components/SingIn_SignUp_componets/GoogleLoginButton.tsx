import { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import UsernamePromptModal from "../../components/SingIn_SignUp_componets/UsernamePromptModal";
import { useGoogleLogin, useGoogleRegister } from "../../API/AccountApi";
import { getApiError } from "../../functions/getApiError";

interface Props {
  onLoginSuccess: (username: string) => void;
  onError?: (message: string) => void;
  onClose?: () => void;
}

const GoogleLoginButton = ({ onLoginSuccess, onError, onClose }: Props) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [idToken, setIdToken] = useState("");

  //Api hooks:
  const { mutate: googleLogin } = useGoogleLogin();
  const { mutate: googleRegister } = useGoogleRegister();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    const googleToken = credentialResponse.credential;
    if (!googleToken) return;
    setIdToken(googleToken!);

    googleLogin({ idToken: googleToken }, {
        onSuccess: (data) => {
          localStorage.setItem("token", data.token);
          localStorage.setItem("logged_username", data.userName);
          onLoginSuccess(data.userName);
          onClose?.();
        },
        onError: (error: any) => {
          const apiErr = getApiError(error);
          if (apiErr?.message === "Brakuje nazwy użytkownika do rejestracji.") {
            setShowPrompt(true);
          } else {
            onError?.("Błąd logowania przez Google");
            console.error(error);
          }
        },
      }
    );
  };

  //Jeśli nie użytkownik nie ma konta to dodatkowo przesyłamy uzyskany od niego username
  const handleUsernameSubmit = (username: string) => {
    googleRegister({ idToken, userName: username }, {
        onSuccess: (data) => {
          localStorage.setItem("token", data.token);
          localStorage.setItem("logged_username", data.userName);
          onLoginSuccess(data.userName);
          setShowPrompt(false);
          onClose?.();
        },
        onError: (error: any) => {
          setShowPrompt(false);
          const message = error?.response?.data ?? "Nie udało się ukończyć rejestracji przez Google.";
          onError?.(message);
          console.error(error);
        },
      }
    );
  };

  return (
    <>
      <div className="d-flex justify-content-center mt-3">
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => onError?.("Błąd Google")} />
      </div>
      <UsernamePromptModal show={showPrompt} onClose={() => setShowPrompt(false)} onSubmit={handleUsernameSubmit}/>
    </>
  );
};

export default GoogleLoginButton;