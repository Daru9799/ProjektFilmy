import axios from "axios";
import { API_BASE_URL } from "../constants/api";
import { useApiMutation } from "../hooks/useApiMutation ";
import { useQueryClient } from "@tanstack/react-query";

//Wersja sprzed customowego hooka

// export const useLogin = () => {
//   const mutation = useMutation({
//     mutationFn: async ({ email, password }: { email: string; password: string }) => {
//       const response = await axios.post(`${API_BASE_URL}/Account/login`, { email, password });
//       return response.data;
//     },
//   });
//   return {
//     ...mutation,
//     apiError: getApiError(mutation.error)
//   };
// };

//Customowy hook call api logowanie obsługujacy error handling
export const useLogin = () => {
  return useApiMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const res = await axios.post(`${API_BASE_URL}/Account/login`, { email, password }, { withCredentials: true });
      return res.data;
    },
  });
};

export const useRegister = () => {
  return useApiMutation({
    mutationFn: async ({ email, username, password }: { email: string; username: string; password: string }) => {
      const res = await axios.post(`${API_BASE_URL}/Account/register`, {
        email,
        userName: username,
        password,
      });
      return res.data;
    },
  });
};

export const useEditUser = () => {
  const queryClient = useQueryClient();
  return useApiMutation({
    mutationFn: async ({ userName, email }: { userName: string; email: string }) => {
      const res = await axios.patch(`${API_BASE_URL}/Account/edit`, { 
          NewLogin: userName, 
          NewEmail: email 
        },
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}` 
          } 
        }
      );
      return res.data;
    },
    onSuccess: (userName) => {
      queryClient.invalidateQueries({ queryKey: ["userData", userName] });
    }
  });
};

export const useChangePassword = () => {
  return useApiMutation({
    mutationFn: async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
      await axios.patch(`${API_BASE_URL}/Account/change-password`, { 
          currentPassword, 
          newPassword 
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    },
  });
};

//Logowanie przez google
export const useGoogleLogin = () => {
  return useApiMutation({
    mutationFn: async ({ idToken }: { idToken: string }) => {
      const res = await axios.post(`${API_BASE_URL}/Account/google-login`, {
        idToken,
      });
      return res.data;
    },
  });
};

//Rejestracja nowego użytkownika przez Google (gdy backend wymaga username)
export const useGoogleRegister = () => {
  return useApiMutation({
    mutationFn: async ({ idToken, userName }: { idToken: string; userName: string }) => {
      const res = await axios.post(`${API_BASE_URL}/Account/google-login`, {
        idToken,
        userName,
      });
      return res.data;
    },
  });
};