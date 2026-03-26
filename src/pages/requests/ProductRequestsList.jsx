import { useMemo } from "react";
import { Box, Paper, Typography, Button, IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { toast } from "react-toastify";
import { useStaffProductRequestList } from "../../query-hooks/requests/useStaffProductRequestList";
import { useStaffProductRequestStatuses } from "../../query-hooks/requests/useStaffProductRequestStatuses";
import { useUpdateStaffProductRequestStatus } from "../../query-hooks/requests/useUpdateStaffProductRequestStatus";
import UpdateStatusPopup from "./UpdateStatusPopup";
import RequestDetailDialog from "./RequestDetailDialog";
import RequestCard from "./RequestCard";
import { useState } from "react";
import { useIsDepartmentAdminStaff } from "../../hooks/useIsDepartmentAdminStaff";
import { STAFF_FILTER_UNASSIGNED } from "../../constants/staffRequestFilters";

const ProductRequestsList = ({ statusFilter = "", staffFilter = "" }) => {
  const isDeptAdmin = useIsDepartmentAdminStaff();
  const [updateStatusPopupOpen, setUpdateStatusPopupOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRequest, setDetailRequest] = useState(null);

  const { data = [], isLoading, error, refetch } = useStaffProductRequestList();
  const {
    data: statuses = [],
    isLoading: statusesLoading,
    error: statusesError,
  } = useStaffProductRequestStatuses();
  const updateMutation = useUpdateStaffProductRequestStatus();

  const isStatusClosed = (row) =>
    row?.items?.every(
      (r) =>
        String(r?.status?.name || "").toUpperCase() === "DELIVERED" ||
        String(r?.status?.name || "").toUpperCase() === "NOTDELIVERED"
    ) ?? false;

  const handleOpenUpdateStatus = (row) => {
    setSelectedRequest(row?.items ? { items: row.items } : row);
    setUpdateStatusPopupOpen(true);
  };

  const groupedData = useMemo(() => {
    const groups = new Map();
    (data || []).forEach((row) => {
      const key = row?.requestGroupId || row?.id;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(row);
    });
    return Array.from(groups.values()).map((items) => ({
      items,
      id: items[0]?.id,
      assignedTo: items[0]?.assignedTo,
      productNames: items.map((r) => r?.product?.name).filter(Boolean).join(", ") || "—",
      room: items[0]?.room,
      status: items[0]?.status,
      userName: items[0]?.userName,
      phoneNumber: items[0]?.phoneNumber,
      updatedDate: items[0]?.updatedDate,
    }));
  }, [data]);

  const filteredData = useMemo(() => {
    let rows = groupedData;
    if (statusFilter) {
      rows = rows.filter((row) =>
        row?.items?.some((r) => r?.status?.id === statusFilter)
      );
    }
    if (staffFilter) {
      if (staffFilter === STAFF_FILTER_UNASSIGNED) {
        rows = rows.filter((row) => row?.items?.every((r) => !r?.assignedTo?.id));
      } else {
        rows = rows.filter((row) =>
          row?.items?.some((r) => r?.assignedTo?.id === staffFilter)
        );
      }
    }
    return rows;
  }, [groupedData, statusFilter, staffFilter]);

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
          Failed to load product requests
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
            ? "No product requests in your department"
            : "No product requests assigned to you"}
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
          type="product"
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
        key={updateStatusPopupOpen ? selectedRequest?.id ?? "open" : "closed"}
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
        type="product"
        requestId={detailRequest?.items?.[0]?.id ?? detailRequest?.id}
        listRow={detailRequest}
      />
    </Box>
  );
};

export default ProductRequestsList;
