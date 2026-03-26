import { useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  Box,
  Tabs,
  Tab,
  Autocomplete,
  TextField,
  Typography,
} from "@mui/material";
import { MODULES } from "../../constants/modules";
import { useStaffServiceRequestStatuses } from "../../query-hooks/requests/useStaffServiceRequestStatuses";
import { useStaffProductRequestStatuses } from "../../query-hooks/requests/useStaffProductRequestStatuses";
import { useStaffServiceRequestList } from "../../query-hooks/requests/useStaffServiceRequestList";
import { useStaffProductRequestList } from "../../query-hooks/requests/useStaffProductRequestList";
import ProductRequestsList from "./ProductRequestsList";
import ServiceRequestsList from "./ServiceRequestsList";
import MyRequestsList from "./MyRequestsList";
import { useIsDepartmentAdminStaff } from "../../hooks/useIsDepartmentAdminStaff";
import { staffAssigneeDisplayName } from "../../utils/staffDisplayName";
import { STAFF_FILTER_UNASSIGNED } from "../../constants/staffRequestFilters";

const TAB_FROM_HASH = { "#service": 0, "#products": 1, "#my-requests": 2 };
const HASH_FROM_TAB = { 0: "service", 1: "products", 2: "my-requests" };

function buildStaffFilterOptions(rows) {
  const byId = new Map();
  let hasUnassigned = false;
  for (const row of rows || []) {
    const at = row?.assignedTo;
    if (!at?.id) {
      hasUnassigned = true;
      continue;
    }
    if (!byId.has(at.id)) {
      const label = staffAssigneeDisplayName(at) || "Staff";
      byId.set(at.id, { id: at.id, label });
    }
  }
  const opts = Array.from(byId.values()).sort((a, b) => a.label.localeCompare(b.label));
  if (hasUnassigned) opts.unshift({ id: STAFF_FILTER_UNASSIGNED, label: "Unassigned" });
  return opts;
}

export default function RequestsList() {
  const { hash } = useLocation();
  const [searchParams] = useSearchParams();
  const isDeptAdmin = useIsDepartmentAdminStaff();
  const [statusFilter, setStatusFilter] = useState("");
  const [staffFilter, setStaffFilter] = useState("");
  const { data: serviceStatusesResponse } = useStaffServiceRequestStatuses();
  const { data: productStatusesData } = useStaffProductRequestStatuses();

  const tab = TAB_FROM_HASH[hash] ?? 0;

  const { data: serviceRowsForStaffFilter = [] } = useStaffServiceRequestList({
    enabled: isDeptAdmin && tab === 0,
  });
  const { data: productRowsForStaffFilter = [] } = useStaffProductRequestList({
    enabled: isDeptAdmin && tab === 1,
  });

  const serviceStatuses = Array.isArray(serviceStatusesResponse)
    ? serviceStatusesResponse
    : (serviceStatusesResponse?.list ?? []);
  const productStatusesList = Array.isArray(productStatusesData)
    ? productStatusesData
    : (productStatusesData?.list ?? []);

  const statuses = tab === 0 ? serviceStatuses : tab === 1 ? productStatusesList : [];
  const selectedStatus = statuses.find((s) => s.id === statusFilter) ?? null;

  const staffFilterOptions = useMemo(() => {
    if (!isDeptAdmin) return [];
    const rows = tab === 0 ? serviceRowsForStaffFilter : tab === 1 ? productRowsForStaffFilter : [];
    return buildStaffFilterOptions(rows);
  }, [isDeptAdmin, tab, serviceRowsForStaffFilter, productRowsForStaffFilter]);

  const selectedStaffOption =
    staffFilterOptions.find((o) => o.id === staffFilter) ?? null;

  useEffect(() => {
    if (!isDeptAdmin) return;
    const fromUrl = searchParams.get("staffId");
    if (fromUrl) setStaffFilter(fromUrl);
  }, [isDeptAdmin, searchParams]);

  const handleChange = (_, newValue) => {
    setStatusFilter("");
    setStaffFilter("");
    window.location.hash = HASH_FROM_TAB[newValue];
  };

  const handleStatusFilterChange = (_, newValue) => {
    setStatusFilter(newValue?.id ?? "");
  };

  const handleStaffFilterChange = (_, newValue) => {
    setStaffFilter(newValue?.id ?? "");
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Requests
          </Typography>
          {isDeptAdmin && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Service and product tabs show all requests for your department.
            </Typography>
          )}
        </Box>
      </Box>

      <Tabs
        value={tab}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          mb: 2,
          "& .MuiTabs-flexContainer": { flexWrap: "nowrap" },
          "& .MuiTab-root": {
            minHeight: 48,
            minWidth: "auto",
            px: 2,
            whiteSpace: "nowrap",
          },
          "& .MuiTabs-indicator": { height: 3, borderRadius: "3px 3px 0 0" },
        }}
      >
        <Tab label="Service" />
        <Tab label="Product" />
        <Tab label="My requests" />
      </Tabs>

      {tab !== 2 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 2,
          }}
        >
          <Autocomplete
            size="small"
            options={statuses}
            value={selectedStatus}
            onChange={handleStatusFilterChange}
            getOptionLabel={(o) => o?.displayName || o?.name || ""}
            isOptionEqualToValue={(a, b) => a?.id === b?.id}
            renderInput={(params) => (
              <TextField {...params} placeholder="Filter by status" />
            )}
            sx={{ flex: 1 }}
          />
          {isDeptAdmin && (
            <Autocomplete
              size="small"
              options={staffFilterOptions}
              value={selectedStaffOption}
              onChange={handleStaffFilterChange}
              getOptionLabel={(o) => o?.label ?? ""}
              isOptionEqualToValue={(a, b) => a?.id === b?.id}
              renderInput={(params) => (
                <TextField {...params} placeholder="Filter by staff" />
              )}
              sx={{ flex: 1 }}
            />
          )}
        </Box>
      )}

      {tab === 0 && (
        <ServiceRequestsList statusFilter={statusFilter} staffFilter={staffFilter} />
      )}
      {tab === 1 && (
        <ProductRequestsList statusFilter={statusFilter} staffFilter={staffFilter} />
      )}
      {tab === 2 && <MyRequestsList />}
    </Box>
  );
}
