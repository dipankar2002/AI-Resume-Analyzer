import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ClerkProvider } from "@clerk/react";

import "./index.css";
import App from "./App.jsx";
import { AppThemeProvider } from "./contexts/ThemeSettingsContext";

const clerkPublishableKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error(
    "Missing VITE_CLERK_PUBLISHABLE_KEY in .env"
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      signInUrl="/login"
      signUpUrl="/register"
    >
      <AppThemeProvider>
        <App />
      </AppThemeProvider>
    </ClerkProvider>
  </StrictMode>
);