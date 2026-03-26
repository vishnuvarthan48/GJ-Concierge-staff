import { useMemo, useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useIsDepartmentAdminStaff } from "../../hooks/useIsDepartmentAdminStaff";
import { getDepartmentStaffs } from "../../api/staff/index";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { MODULES } from "../../constants/modules";

const getStaffLabel = (staff) => {
  const user = staff?.user;
  const full = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  return full || user?.name || user?.email || "Staff";
};

export default function DepartmentStaffs() {
  const navigate = useNavigate();
  const { tenantId, locationId, staff } = useAuth();
  const isDeptAdmin = useIsDepartmentAdminStaff();
  const [search, setSearch] = useState("");

  const departmentId = staff?.department?.id;
  const {
    data: rows = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: [QUERY_KEYS.DEPARTMENT_STAFFS, tenantId, locationId, departmentId],
    queryFn: () => getDepartmentStaffs({ tenantId, locationId, departmentId }),
    enabled: Boolean(isDeptAdmin && tenantId && locationId && departmentId),
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((s) => {
      const label = getStaffLabel(s).toLowerCase();
      const email = (s?.user?.email || "").toLowerCase();
      return label.includes(q) || email.includes(q);
    });
  }, [rows, search]);

  const goToRequestsWithStaff = (staffId) => {
    if (!staffId) return;
    navigate(`/${MODULES.REQUESTS}?staffId=${encodeURIComponent(staffId)}#service`);
  };

  if (!isDeptAdmin) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography color="text.secondary">
          Staff list is available for department admins only.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Staff
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Select a staff member to open Requests with the staff filter applied.
      </Typography>

      <TextField
        fullWidth
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search staff"
        InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} /> }}
        sx={{ mb: 2 }}
      />

      {isLoading && (
        <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
          <CircularProgress size={26} />
        </Box>
      )}

      {isError && (
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Typography color="error">Failed to load department staff.</Typography>
        </Paper>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <Typography color="text.secondary" sx={{ py: 2 }}>
          No staff found.
        </Typography>
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
          <List disablePadding>
            {filtered.map((item, idx) => (
              <ListItemButton
                key={item?.id || idx}
                divider={idx !== filtered.length - 1}
                onClick={() => goToRequestsWithStaff(item?.id)}
              >
                <ListItemText
                  primary={getStaffLabel(item)}
                  secondary={item?.user?.email || ""}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
