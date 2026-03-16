import { alpha } from "@mui/material";

const lightmodeMainColor = "#4FA3C7";
const darkmodeMainColor = "#6EE7C7";

const lightPalette = {
  mode: "light",
  primary: {
    main: lightmodeMainColor,
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#5B6B79",
  },
  background: {
    default: "#f4f6f8",
    paper: "#f9fbfc",
    warning: "#e66161",
  },
  text: {
    primary: "#555d77ff",
    secondary: "#555555",
    active: "rgba(3, 156, 136, 1)",
    paper: "#ffffff",
  },
  tableHead: {
    primary: alpha(lightmodeMainColor, 0.3),
  },
};

const darkPalette = {
  mode: "dark",
  primary: {
    main: darkmodeMainColor,
  },
  secondary: {
    main: "#E5E7EB",
  },
  background: {
    default: "#121212",
    paper: "#1e1e1e",
    warning: "#e66161",
  },
  text: {
    primary: "#ffffff",
    secondary: "#b2aaaa",
    paper: "#ffffff",
  },
  tableHead: {
    primary: alpha(darkmodeMainColor, 0.3),
  },
};

export { lightPalette, darkPalette };
