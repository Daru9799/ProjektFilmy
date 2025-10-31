import React from "react";
import { useCreateCalendarEvent, useGoogleCalendarConnect } from "../API/GoogleCalendarApi";

const TestPage: React.FC = () => {
  const { connect } = useGoogleCalendarConnect();
  const { mutate: addToCalendar, isPending: addingCalendar } = useCreateCalendarEvent();

  const handleAdd = () => {
    addToCalendar({
      summary: "Diuna 2",
      description: "Wypad do kina z ekipą",
      startDateTime: new Date("2025-11-05T20:00:00").toISOString(),
      endDateTime: new Date("2025-11-05T22:30:00").toISOString(),
      eventType: "Kino",
      locationName: "Cinema City",
      locationAddress: "Warszawa, Arkadia",
      movieId: "2137",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 gap-4">
      <h1 className="text-2xl text-white font-bold">Połącz z Google Calendar</h1>
      <p className="text-white text-center max-w-md">
        Kliknij poniżej, aby połączyć swoje konto Google i synchronizować wydarzenia filmowe.
      </p>
        {/* CONNECT */}
        <button onClick={connect} className="btn btn-success mx-2 mb-2">
          Połącz konto Google
        </button>

        {/* POST */}
        <button onClick={handleAdd} disabled={addingCalendar} className="btn btn-primary mb-2">
          {addingCalendar ? "Dodawanie..." : "Dodaj do kalendarza"}
        </button>
    </div>
  );
};

export default TestPage;