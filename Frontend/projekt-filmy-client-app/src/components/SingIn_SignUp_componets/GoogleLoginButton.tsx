import React, { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import UsernamePromptModal from "../../components/SingIn_SignUp_componets/UsernamePromptModal";
import axios from "axios";

interface Props {
  onLoginSuccess: (username: string) => void;
  onError?: (message: string) => void;
  onClose?: () => void;
}

const GoogleLoginButton = ({ onLoginSuccess, onError, onClose }: Props) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [idToken, setIdToken] = useState("");

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential;
    setIdToken(token!);

    try {
      const response = await axios.post("https://localhost:7053/api/Account/google-login", {
        idToken: token,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("logged_username", response.data.userName);
      onLoginSuccess(response.data.userName);
      onClose?.();
    } catch (error: any) {
      if (error.response?.data === "Brakuje nazwy użytkownika do rejestracji.") {
        //W przypadku nowego użytkownika
        setShowPrompt(true);
      } else {
        onError?.("Błąd logowania przez Google");
        console.error(error);
      }
    }
  };

  //Jeśli nie użytkownik nie ma konta to dodatkowo przesyłamy uzyskany od niego username
  const handleUsernameSubmit = async (username: string) => {
    try {
      const response = await axios.post("https://localhost:7053/api/Account/google-login", {
        idToken,
        userName: username,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("logged_username", response.data.userName);
      onLoginSuccess(response.data.userName);
      setShowPrompt(false);
      onClose?.();
    } catch (error: any) {
      setShowPrompt(false);
      console.error(error)
      const message = error.response?.data ?? "Nie udało się ukończyć rejestracji przez Google.";
      onError?.(message);
    }
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