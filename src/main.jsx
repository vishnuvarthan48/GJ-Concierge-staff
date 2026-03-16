import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AppContexts from "./contexts/AppContext.jsx";
import AppProviders from "./providers/AppProviders.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppContexts>
      <AppProviders>
        <App />
      </AppProviders>
    </AppContexts>
  </StrictMode>
);
