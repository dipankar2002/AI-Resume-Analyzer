import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ThemeProvider,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import {
  COLOR_PRESETS,
  DEFAULT_THEME_SETTINGS,
  createAppTheme,
} from "../theme";

const THEME_STORAGE_KEY = "ai-resume-analyzer-theme-settings";

const ThemeSettingsContext = createContext(null);

function getInitialSettings() {
  try {
    const storedValue = localStorage.getItem(THEME_STORAGE_KEY);
    if (!storedValue) {
      return DEFAULT_THEME_SETTINGS;
    }

    const parsedValue = JSON.parse(storedValue);
    const mode = parsedValue.mode === "dark" ? "dark" : "light";
    const colorPreset =
      COLOR_PRESETS[parsedValue.colorPreset]
        ? parsedValue.colorPreset
        : DEFAULT_THEME_SETTINGS.colorPreset;

    return {
      mode,
      colorPreset,
    };
  } catch {
    return DEFAULT_THEME_SETTINGS;
  }
}

export function AppThemeProvider({ children }) {
  const [settings, setSettings] = useState(getInitialSettings);

  useEffect(() => {
    localStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify(settings)
    );
  }, [settings]);

  const theme = useMemo(
    () => createAppTheme(settings),
    [settings]
  );

  const contextValue = useMemo(
    () => ({
      mode: settings.mode,
      colorPreset: settings.colorPreset,
      colorPresets: COLOR_PRESETS,
      setMode: (mode) => {
        setSettings((prev) => ({
          ...prev,
          mode: mode === "dark" ? "dark" : "light",
        }));
      },
      setColorPreset: (colorPreset) => {
        if (!COLOR_PRESETS[colorPreset]) {
          return;
        }

        setSettings((prev) => ({
          ...prev,
          colorPreset,
        }));
      },
      toggleMode: () => {
        setSettings((prev) => ({
          ...prev,
          mode: prev.mode === "light" ? "dark" : "light",
        }));
      },
    }),
    [settings]
  );

  return (
    <ThemeSettingsContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeSettingsContext.Provider>
  );
}

export function useThemeSettings() {
  const context = useContext(ThemeSettingsContext);

  if (!context) {
    throw new Error(
      "useThemeSettings must be used within AppThemeProvider"
    );
  }

  return context;
}
