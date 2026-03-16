import { useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { getStorageItem, setStorageItem } from "../utils/localStorageHandler";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { THEMES } from "../constants/theme";

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(
    () => getStorageItem(STORAGE_KEYS.CONCIERGE_THEME) || THEMES.LIGHT
  );

  const toggleTheme = () => {
    setMode((prev) => {
      const nextMode = prev === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
      setStorageItem(STORAGE_KEYS.CONCIERGE_THEME, nextMode);
      return nextMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
