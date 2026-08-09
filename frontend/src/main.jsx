import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import "./index.css";
import App from "./App.jsx";
import theme from "./theme.js";
import { ClerkProvider } from '@clerk/react'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ClerkProvider>
      <App />
    </ClerkProvider>
    </ThemeProvider>
  </StrictMode>
);