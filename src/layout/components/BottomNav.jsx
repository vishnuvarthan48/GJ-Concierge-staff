import { useNavigate, useLocation } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction, Paper, Box } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import { MODULES } from "../../constants/modules";
import { useIsDepartmentAdminStaff } from "../../hooks/useIsDepartmentAdminStaff";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const isDeptAdmin = useIsDepartmentAdminStaff();

  const value =
    path.includes(MODULES.STAFF) ? "staff" :
    path.includes(MODULES.REQUESTS) ? "requests" :
    path.includes(MODULES.DASHBOARD) ? "dashboard" : "dashboard";

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: "18px 18px 0 0",
          border: "none",
          bgcolor: "background.paper",
          boxShadow: (theme) =>
            `0 -10px 24px ${theme.palette.mode === "dark" ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.08)"}`,
        }}
      >
        <BottomNavigation
          value={value}
          onChange={(_, v) => {
            if (v === "dashboard") navigate(`/${MODULES.DASHBOARD}`);
            if (v === "requests") navigate(`/${MODULES.REQUESTS}`);
            if (v === "staff") navigate(`/${MODULES.STAFF}`);
          }}
          showLabels
          sx={{
            "& .MuiBottomNavigationAction-root.Mui-selected": {
              color: "primary.main",
            },
          }}
        >
          <BottomNavigationAction
            label="Dashboard"
            value="dashboard"
            icon={<DashboardIcon />}
          />
          <BottomNavigationAction
            label="Requests"
            value="requests"
            icon={<AssignmentIcon />}
          />
          {isDeptAdmin && (
            <BottomNavigationAction
              label="Staff"
              value="staff"
              icon={<PeopleIcon />}
            />
          )}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
