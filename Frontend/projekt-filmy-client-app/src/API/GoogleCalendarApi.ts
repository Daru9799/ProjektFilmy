import { API_BASE_URL } from "../constants/api";

export const useGoogleCalendarConnect = () => {
  const connect = () => {
    const returnUrl = window.location.href; //aktualny adres na froncie
    window.location.href = `${API_BASE_URL}/GoogleCalendar/connect?returnUrl=${encodeURIComponent(returnUrl)}`;
  };

  return { connect };
};