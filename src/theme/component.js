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
      }),
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
