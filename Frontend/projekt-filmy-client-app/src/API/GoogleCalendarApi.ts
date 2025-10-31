import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "../constants/api";
import { CalendarEventDto } from "../models/CalendarEvent";
import axios from "axios";

export const useGoogleCalendarConnect = () => {
  const connect = () => {
    const returnUrl = window.location.href; //aktualny adres na froncie
    window.location.href = `${API_BASE_URL}/GoogleCalendar/connect?returnUrl=${encodeURIComponent(returnUrl)}`;
  };

  return { connect };
};

export const useCreateCalendarEvent = () => {
  return useMutation({ mutationFn: async (eventData: CalendarEventDto) => {
      await axios.post(
        `${API_BASE_URL}/GoogleCalendar/add`, {
          Summary: eventData.summary,
          Description: eventData.description,
          StartDateTime: eventData.startDateTime,
          EndDateTime: eventData.endDateTime,
          EventType: eventData.eventType,
          MovieId: eventData.movieId,
          AttendeesEmails: eventData.attendeesEmails,
          LocationName: eventData.locationName,
          LocationAddress: eventData.locationAddress,
        },
        {
          withCredentials: true,
        }
      );
    },
  });
};