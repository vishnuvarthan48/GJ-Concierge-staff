import { alpha } from "@mui/material/styles";
import { tableComponents } from "./components/table";

/* Mobile-first: min 44px touch targets, larger inputs */
const components = {
  MuiCssBaseline: {
    styleOverrides: {
      body: ({ theme }) => ({
        backgroundImage: `radial-gradient(circle at 20% 0%, ${alpha(
          theme.palette.primary.main,
          theme.palette.mode === "dark" ? 0.14 : 0.08
        )} 0%, transparent 45%)`,
      }),
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
      size: "medium",
    },
    styleOverrides: {
      root: {
        textTransform: "none",
        borderRadius: 12,
        minHeight: 44,
        padding: "10px 16px",
      },
      contained: {
        color: (theme) => theme.palette.primary.contrastText,
        boxShadow: (theme) =>
          `0 8px 18px ${alpha(theme.palette.primary.main, 0.24)}`,
        "&:active": {
          boxShadow: (theme) =>
            `0 10px 20px ${alpha(theme.palette.primary.main, 0.28)}`,
        },
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
        borderRadius: 16,
      },
    },
  },
  MuiCard: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 16,
        border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
        boxShadow: `0 8px 24px ${alpha("#000000", theme.palette.mode === "dark" ? 0.3 : 0.08)}`,
        transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
      }),
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
        height: 68,
        borderRadius: 18,
      },
    },
  },
  MuiBottomNavigationAction: {
    styleOverrides: {
      root: {
        minWidth: "auto",
        paddingTop: 8,
        transition: "all 160ms ease",
      },
      label: {
        fontSize: "0.8rem",
        "&.Mui-selected": {
          fontSize: "0.84rem",
          fontWeight: 700,
        },
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: "outlined",
      size: "small",
      fullWidth: true,
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        minHeight: 42,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: alpha(
          theme.palette.background.paper,
          theme.palette.mode === "dark" ? 0.35 : 0.92
        ),
        transition: "all 160ms ease",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: alpha(theme.palette.text.primary, 0.14),
        },
        "&:active .MuiOutlinedInput-notchedOutline": {
          borderColor: alpha(theme.palette.primary.main, 0.35),
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
          borderWidth: 1.5,
        },
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
        fontSize: "0.9rem",
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        fontWeight: 600,
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      indicator: {
        height: 3,
        borderRadius: 999,
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: "none",
        minHeight: 44,
        fontWeight: 600,
      },
    },
  },
  ...tableComponents,
};

export default components;
