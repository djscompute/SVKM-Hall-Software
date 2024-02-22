import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    </BrowserRouter>
  </React.StrictMode>
);
