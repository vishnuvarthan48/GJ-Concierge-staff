import { useNavigate, useLocation } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { MODULES } from "../../constants/modules";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const value =
    path.includes(MODULES.REQUESTS) ? "requests" :
    path.includes(MODULES.DASHBOARD) ? "dashboard" : "dashboard";

  return (
    <BottomNavigation
      value={value}
      onChange={(_, v) => {
        if (v === "dashboard") navigate(`/${MODULES.DASHBOARD}`);
        if (v === "requests") navigate(`/${MODULES.REQUESTS}`);
      }}
      showLabels
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: "1px solid",
        borderColor: "divider",
        background: "background.paper",
        paddingBottom: "env(safe-area-inset-bottom)",
        zIndex: 1100,
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
    </BottomNavigation>
  );
}
