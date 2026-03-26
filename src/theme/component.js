import { alpha } from "@mui/material/styles";
import { tableComponents } from "./components/table";

/* Mobile-first: min 44px touch targets, larger inputs */
const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: "none",
        borderRadius: 12,
        boxShadow: "none",
        minHeight: 44,
        padding: "10px 20px",
      },
      contained: {
        color: (theme) => theme.palette.primary.contrastText,
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        minWidth: 44,
        minHeight: 44,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: "none",
        borderRadius: 12,
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        margin: 16,
        maxWidth: "calc(100% - 32px)",
        maxHeight: "calc(100% - 32px)",
        width: "100%",
        borderRadius: 16,
      },
    },
  },
  MuiBottomNavigation: {
    styleOverrides: {
      root: {
        paddingBottom: "env(safe-area-inset-bottom)",
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: "outlined",
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: () => ({
        height: 42,
        borderRadius: 3,
        overflow: "hidden",
      }),
      input: ({ theme }) => {
        const isDark = theme.palette.mode === "dark";
        const autofillBg = isDark
          ? alpha(theme.palette.primary.main, 0.06)
          : alpha(theme.palette.primary.main, 0.04);
        return {
          "&:-webkit-autofill": {
            WebkitBoxShadow: `0 0 0 100px ${autofillBg} inset`,
            boxShadow: `0 0 0 100px ${autofillBg} inset`,
            WebkitTextFillColor: theme.palette.text.primary,
            borderRadius: 3,
            transition: "background-color 5000s ease-in-out 0s",
          },
          "&:-webkit-autofill:hover": {
            WebkitBoxShadow: `0 0 0 100px ${autofillBg} inset`,
            boxShadow: `0 0 0 100px ${autofillBg} inset`,
          },
          "&:-webkit-autofill:focus": {
            WebkitBoxShadow: `0 0 0 100px ${autofillBg} inset`,
            boxShadow: `0 0 0 100px ${autofillBg} inset`,
          },
        };
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        transform: "none",
        fontSize: "0.875rem",
      },
    },
  },
  ...tableComponents,
};

export default components;
