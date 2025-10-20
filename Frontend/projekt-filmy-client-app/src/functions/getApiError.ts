import { AxiosError } from "axios";
import { ApiError } from "../models/ApiError";

//Konwerter errora otrzymanego z Axiosa do obiektu błędu
export const getApiError = (error: unknown) => {
  if (!error) return null;
  const axiosError = error as AxiosError<ApiError>;

  //Konwersja i domyślne błędy
  const statusCode = axiosError.response?.data?.statusCode ?? axiosError.response?.status ?? 500;
  const type = axiosError.response?.data?.type ?? axiosError.code ?? "UnknownError";
  const message = axiosError.response?.data?.message ?? axiosError.message ?? "Wystąpił nieoczekiwany błąd.";
  const time = axiosError.response?.data?.time ?? new Date().toISOString();

  return { statusCode, type, message, time };
};