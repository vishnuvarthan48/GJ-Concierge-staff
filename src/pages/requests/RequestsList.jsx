import { useState } from "react";
import { useLocation } from "react-router-dom";
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
import ProductRequestsList from "./ProductRequestsList";
import ServiceRequestsList from "./ServiceRequestsList";
import MyRequestsList from "./MyRequestsList";

const TAB_FROM_HASH = { "#service": 0, "#products": 1, "#my-requests": 2 };
const HASH_FROM_TAB = { 0: "service", 1: "products", 2: "my-requests" };

export default function RequestsList() {
  const { hash } = useLocation();
  const [statusFilter, setStatusFilter] = useState("");
  const { data: serviceStatusesResponse } = useStaffServiceRequestStatuses();
  const { data: productStatusesData } = useStaffProductRequestStatuses();

  const serviceStatuses = Array.isArray(serviceStatusesResponse)
    ? serviceStatusesResponse
    : (serviceStatusesResponse?.list ?? []);
  const productStatusesList = Array.isArray(productStatusesData)
    ? productStatusesData
    : (productStatusesData?.list ?? []);

  const tab = TAB_FROM_HASH[hash] ?? 0;
  const statuses = tab === 0 ? serviceStatuses : tab === 1 ? productStatusesList : [];
  const selectedStatus = statuses.find((s) => s.id === statusFilter) ?? null;

  const handleChange = (_, newValue) => {
    setStatusFilter("");
    window.location.hash = HASH_FROM_TAB[newValue];
  };

  const handleStatusFilterChange = (_, newValue) => {
    setStatusFilter(newValue?.id ?? "");
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
        <Typography variant="h6" fontWeight={600}>
          Requests
        </Typography>
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
          sx={{ mb: 2 }}
        />
      )}

      {tab === 0 && <ServiceRequestsList statusFilter={statusFilter} />}
      {tab === 1 && <ProductRequestsList statusFilter={statusFilter} />}
      {tab === 2 && <MyRequestsList />}
    </Box>
  );
}
