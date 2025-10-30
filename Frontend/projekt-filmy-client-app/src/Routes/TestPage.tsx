import React from "react";
import { useGoogleCalendarConnect } from "../API/GoogleCalendarApi";

const TestPage: React.FC = () => {
  const { connect } = useGoogleCalendarConnect();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 gap-4">
      <h1 className="text-2xl text-white font-bold">Połącz z Google Calendar</h1>
      <p className="text-white text-center max-w-md">
        Kliknij poniżej, aby połączyć swoje konto Google i synchronizować wydarzenia filmowe.
      </p>
      <button
        onClick={connect}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
      >
        Połącz konto Google
      </button>
    </div>
  );
};

export default TestPage;