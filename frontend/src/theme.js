import { createTheme } from "@mui/material/styles";

export const COLOR_PRESETS = {
  blue: {
    primary: "#2563EB",
    secondary: "#1D4ED8",
  },
  purple: {
    primary: "#7C3AED",
    secondary: "#6D28D9",
  },
  pink: {
    primary: "#DB2777",
    secondary: "#BE185D",
  },
  green: {
    primary: "#16A34A",
    secondary: "#15803D",
  },
  red: {
    primary: "#DC2626",
    secondary: "#B91C1C",
  },
};

export const DEFAULT_THEME_SETTINGS = {
  mode: "light",
  colorPreset: "blue",
};

export function createAppTheme(settings = DEFAULT_THEME_SETTINGS) {
  const mode = settings.mode === "dark" ? "dark" : "light";
  const preset =
    COLOR_PRESETS[settings.colorPreset] || COLOR_PRESETS.blue;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: preset.primary,
      },
      secondary: {
        main: preset.secondary,
      },
      background: {
        default: mode === "dark" ? "#0B1220" : "#F8FAFC",
        paper: mode === "dark" ? "#111827" : "#FFFFFF",
      },
    },

    typography: {
      fontFamily: "Inter, Arial, sans-serif",

      h1: {
        fontWeight: 700,
      },

      h2: {
        fontWeight: 700,
      },

      h3: {
        fontWeight: 700,
      },

      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },

    shape: {
      borderRadius: 10,
    },
  });
}

export default createAppTheme(DEFAULT_THEME_SETTINGS);