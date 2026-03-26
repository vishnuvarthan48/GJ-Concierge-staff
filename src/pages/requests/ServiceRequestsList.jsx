import { useMemo } from "react";
import { Box, Paper, Typography, Button, IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { toast } from "react-toastify";
import { useStaffServiceRequestList } from "../../query-hooks/requests/useStaffServiceRequestList";
import { useStaffServiceRequestStatuses } from "../../query-hooks/requests/useStaffServiceRequestStatuses";
import { useUpdateStaffServiceRequestStatus } from "../../query-hooks/requests/useUpdateStaffServiceRequestStatus";
import UpdateStatusPopup from "./UpdateStatusPopup";
import RequestDetailDialog from "./RequestDetailDialog";
import RequestCard from "./RequestCard";
import { useState } from "react";
import { useIsDepartmentAdminStaff } from "../../hooks/useIsDepartmentAdminStaff";
import { STAFF_FILTER_UNASSIGNED } from "../../constants/staffRequestFilters";

const ServiceRequestsList = ({ statusFilter = "", staffFilter = "" }) => {
  const isDeptAdmin = useIsDepartmentAdminStaff();
  const [updateStatusPopupOpen, setUpdateStatusPopupOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRequest, setDetailRequest] = useState(null);

  const { data = [], isLoading, error, refetch } = useStaffServiceRequestList();
  const {
    data: statuses = [],
    isLoading: statusesLoading,
    error: statusesError,
  } = useStaffServiceRequestStatuses();
  const updateMutation = useUpdateStaffServiceRequestStatus();

  const isStatusClosed = (row) =>
    String(row?.status?.name || "").toUpperCase() === "CLOSED";

  const handleOpenUpdateStatus = (row) => {
    setSelectedRequest(row);
    setUpdateStatusPopupOpen(true);
  };

  const filteredData = useMemo(() => {
    let rows = data;
    if (statusFilter) {
      rows = rows.filter((row) => row?.status?.id === statusFilter);
    }
    if (staffFilter) {
      if (staffFilter === STAFF_FILTER_UNASSIGNED) {
        rows = rows.filter((row) => !row?.assignedTo?.id);
      } else {
        rows = rows.filter((row) => row?.assignedTo?.id === staffFilter);
      }
    }
    return rows;
  }, [data, statusFilter, staffFilter]);

  const handleSaveStatus = (payload, onSuccess) => {
    updateMutation.mutate(payload, { onSuccess: () => onSuccess?.() });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <Typography color="text.secondary">Loading…</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, textAlign: "center", borderRadius: 2 }}>
        <Typography color="error" sx={{ mb: 2 }}>
          Failed to load service requests
        </Typography>
        <Button variant="contained" onClick={() => refetch()}>
          Retry
        </Button>
      </Paper>
    );
  }

  if (filteredData?.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="text.secondary">
          {isDeptAdmin
            ? "No service requests in your department"
            : "No service requests assigned to you"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton
          onClick={() => refetch()}
          disabled={isLoading}
          aria-label="Refresh"
          sx={{ minWidth: 44, minHeight: 44 }}
        >
          <RefreshIcon />
        </IconButton>
      </Box>

      {filteredData.map((row) => (
        <RequestCard
          key={row.id}
          type="service"
          row={row}
          departmentAdminView={isDeptAdmin}
          isClosed={isStatusClosed(row)}
          onCardClick={() => {
            setDetailRequest(row);
            setDetailOpen(true);
          }}
          onUpdateClick={() => handleOpenUpdateStatus(row)}
        />
      ))}

      <UpdateStatusPopup
        key={updateStatusPopupOpen ? (selectedRequest?.id ?? "open") : "closed"}
        open={updateStatusPopupOpen}
        onClose={() => setUpdateStatusPopupOpen(false)}
        request={selectedRequest}
        statuses={statuses}
        statusesLoading={statusesLoading}
        statusesError={!!statusesError}
        onSave={handleSaveStatus}
        onAllSuccess={() => toast.success("Status updated successfully.")}
        isSaving={updateMutation.isPending}
      />

      <RequestDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        type="service"
        requestId={detailRequest?.id}
        listRow={detailRequest}
      />
    </Box>
  );
};

export default ServiceRequestsList;
