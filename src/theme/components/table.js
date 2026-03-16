export const tableComponents = {
  MuiTable: {
    styleOverrides: {
      root: {
        borderCollapse: "separate",
        width: "100%",
      },
    },
  },
  MuiTableContainer: {
    styleOverrides: {
      root: {
        borderRadius: 2,
        overflowX: "auto",
        maxWidth: "100%",
        boxShadow: "none",
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: ({ theme }) => ({
        transition: theme.transitions.create("background-color", {
          duration: theme.transitions.duration.shorter,
        }),
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
        },
      }),
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        paddingTop: "0.75rem",
        paddingBottom: "0.75rem",
        fontSize: "0.875rem",
        color: theme.palette.text.secondary,
        whiteSpace: "nowrap",
      }),
      head: ({ theme }) => ({
        borderBottom: "none",
        fontWeight: 800,
        fontSize: "0.77rem",
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        color: theme.palette.text.primary,
      }),
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.tableHead.primary,
      }),
    },
  },
};
