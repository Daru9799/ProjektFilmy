import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import "./styles/App.css";
import "./styles/Fonts.css"
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes/Routes";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID!;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <GoogleOAuthProvider clientId={clientId}>
    <RouterProvider router={router} />
  </GoogleOAuthProvider>
);
