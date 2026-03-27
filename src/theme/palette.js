import { alpha } from "@mui/material";

const lightPrimary = "#0F6E8C";
const darkPrimary = "#63D4FF";

const lightPalette = {
  mode: "light",
  primary: {
    main: lightPrimary,
    light: "#3D92AE",
    dark: "#084F69",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#7A5AF8",
    light: "#9B82FF",
    dark: "#5C3DDD",
    contrastText: "#FFFFFF",
  },
  background: {
    default: "#F3F6FA",
    paper: "#FFFFFF",
    warning: "#E66161",
  },
  text: {
    primary: "#12202D",
    secondary: "#5E6B78",
    active: "#0F6E8C",
    paper: "#FFFFFF",
  },
  divider: alpha("#12202D", 0.1),
  tableHead: {
    primary: alpha(lightPrimary, 0.16),
  },
};

const darkPalette = {
  mode: "dark",
  primary: {
    main: darkPrimary,
    light: "#8BE0FF",
    dark: "#2EB5E8",
    contrastText: "#052432",
  },
  secondary: {
    main: "#C7B7FF",
    light: "#E0D7FF",
    dark: "#9D85F7",
    contrastText: "#161327",
  },
  background: {
    default: "#0B1118",
    paper: "#121C27",
    warning: "#FF7D7D",
  },
  text: {
    primary: "#F5FAFF",
    secondary: "#AFC2D4",
    active: "#63D4FF",
    paper: "#FFFFFF",
  },
  divider: alpha("#F5FAFF", 0.12),
  tableHead: {
    primary: alpha(darkPrimary, 0.24),
  },
};

export { lightPalette, darkPalette };
