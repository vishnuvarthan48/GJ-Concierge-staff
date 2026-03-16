import { alpha, createTheme as muiCreateTheme } from "@mui/material/styles";
import { lightPalette, darkPalette } from "./palette";
import typography from "./typography";
import components from "./component";

export const createAppTheme = (mode = "light") => {
  const palette = mode === "dark" ? darkPalette : lightPalette;

  const shadowColor =
    mode === "dark"
      ? alpha(palette.primary.main, 0.35)
      : alpha(palette.primary.main, 0.25);

  const shadows = [
    "none",
    `0px 2px 4px ${shadowColor}`,
    `0px 3px 6px ${shadowColor}`,
    `0px 4px 8px ${shadowColor}`,
    `0px 6px 12px ${shadowColor}`,
    `0px 8px 16px ${shadowColor}`,
    `0px 12px 24px ${shadowColor}`,
  ];

  return muiCreateTheme({
    palette,
    typography,
    components,
    shape: {
      borderRadius: 8,
    },
    shadows,
  });
};
