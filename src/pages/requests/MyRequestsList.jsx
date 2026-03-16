import { useMemo, useState } from "react";
import { Box, Paper, Typography, Button, IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { getStorageItem } from "../../utils/localStorageHandler";
import { STORAGE_KEYS } from "../../constants/storageKeys";
import { useStaffMyServiceRequests } from "../../query-hooks/requests/useStaffMyServiceRequests";
import { useStaffMyProductRequests } from "../../query-hooks/requests/useStaffMyProductRequests";
import { useStaffServiceRequestStatuses } from "../../query-hooks/requests/useStaffServiceRequestStatuses";
import { useStaffProductRequestStatuses } from "../../query-hooks/requests/useStaffProductRequestStatuses";
import { useUpdateStaffServiceRequestStatus } from "../../query-hooks/requests/useUpdateStaffServiceRequestStatus";
import { useUpdateStaffProductRequestStatus } from "../../query-hooks/requests/useUpdateStaffProductRequestStatus";
import UpdateStatusPopup from "./UpdateStatusPopup";
import RequestDetailDialog from "./RequestDetailDialog";
import RequestCard from "./RequestCard";

export default function MyRequestsList() {
  const staffId = getStorageItem(STORAGE_KEYS.STAFF_ID);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRequest, setDetailRequest] = useState(null);
  const [detailType, setDetailType] = useState("service");
  const [updatePopupOpen, setUpdatePopupOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [updateType, setUpdateType] = useState("service");

  const { data: myServiceList = [], isLoading: serviceLoading, error: serviceError, refetch: refetchService } = useStaffMyServiceRequests();
  const { data: myProductList = [], isLoading: productLoading, error: productError, refetch: refetchProduct } = useStaffMyProductRequests();
  const { data: serviceStatuses = [] } = useStaffServiceRequestStatuses();
  const { data: productStatusesData } = useStaffProductRequestStatuses();
  const productStatuses = Array.isArray(productStatusesData) ? productStatusesData : productStatusesData?.list ?? [];
  const serviceUpdateMutation = useUpdateStaffServiceRequestStatus();
  const productUpdateMutation = useUpdateStaffProductRequestStatus();

  const isAssignedToMe = (row, type) => {
    const assignedId = type === "service" ? row?.assignedTo?.id : row?.items?.[0]?.assignedTo?.id ?? row?.assignedTo?.id;
    return assignedId != null && String(assignedId) === String(staffId);
  };

  const isServiceClosed = (row) => String(row?.status?.name || "").toUpperCase() === "CLOSED";
  const isProductClosed = (row) =>
    row?.items?.every(
      (r) =>
        String(r?.status?.name || "").toUpperCase() === "DELIVERED" ||
        String(r?.status?.name || "").toUpperCase() === "NOTDELIVERED"
    ) ?? false;

  const productGrouped = useMemo(() => {
    const groups = new Map();
    (myProductList || []).forEach((row) => {
      const key = row?.requestGroupId || row?.id;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(row);
    });
    return Array.from(groups.values()).map((items) => ({
      items,
      id: items[0]?.id,
      productNames: items.map((r) => r?.product?.name).filter(Boolean).join(", ") || "—",
      room: items[0]?.room,
      status: items[0]?.status,
      userName: items[0]?.userName,
      updatedDate: items[0]?.updatedDate,
      assignedTo: items[0]?.assignedTo,
    }));
  }, [myProductList]);

  const mergedList = useMemo(() => {
    const serviceEntries = (myServiceList || []).map((row) => ({
      type: "service",
      row,
      date: row?.updatedDate ?? row?.lastUpdatedOn ?? 0,
    }));
    const productEntries = productGrouped.map((row) => ({
      type: "product",
      row,
      date: row?.updatedDate ?? 0,
    }));
    return [...serviceEntries, ...productEntries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [myServiceList, productGrouped]);

  const handleOpenDetail = (entry) => {
    setDetailType(entry.type);
    setDetailRequest(entry.row);
    setDetailOpen(true);
  };

  const handleOpenUpdate = (entry) => {
    if (!isAssignedToMe(entry.row, entry.type)) return;
    setUpdateType(entry.type);
    setSelectedRequest(entry.type === "product" ? { items: entry.row.items } : entry.row);
    setUpdatePopupOpen(true);
  };

  const handleSaveStatus = (payload, onSuccess) => {
    if (updateType === "service") {
      serviceUpdateMutation.mutate(payload, { onSuccess: () => onSuccess?.() });
    } else {
      productUpdateMutation.mutate(payload, { onSuccess: () => onSuccess?.() });
    }
  };

  const refetch = () => {
    refetchService();
    refetchProduct();
  };

  const isLoading = serviceLoading || productLoading;
  const error = serviceError || productError;
  const statuses = updateType === "service" ? serviceStatuses : productStatuses;
  const isSaving = updateType === "service" ? serviceUpdateMutation.isPending : productUpdateMutation.isPending;

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
          Failed to load your requests
        </Typography>
        <Button variant="contained" onClick={refetch}>
          Retry
        </Button>
      </Paper>
    );
  }

  if (mergedList.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="text.secondary">
          No requests created by you yet
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton onClick={refetch} disabled={isLoading} aria-label="Refresh" sx={{ minWidth: 44, minHeight: 44 }}>
          <RefreshIcon />
        </IconButton>
      </Box>

      {mergedList.map((entry) => {
        const canUpdate = isAssignedToMe(entry.row, entry.type);
        const isClosed = entry.type === "service" ? isServiceClosed(entry.row) : isProductClosed(entry.row);
        return (
          <RequestCard
            key={`${entry.type}-${entry.row?.id ?? entry.row?.items?.[0]?.id}`}
            type={entry.type}
            row={entry.row}
            isClosed={isClosed}
            showUpdateButton={canUpdate}
            onCardClick={() => handleOpenDetail(entry)}
            onUpdateClick={() => handleOpenUpdate(entry)}
          />
        );
      })}

      <RequestDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        type={detailType}
        requestId={
          detailType === "service"
            ? detailRequest?.id
            : detailRequest?.items?.[0]?.id ?? detailRequest?.id
        }
        listRow={detailRequest}
      />

      <UpdateStatusPopup
        key={updatePopupOpen ? selectedRequest?.id ?? "open" : "closed"}
        open={updatePopupOpen}
        onClose={() => setUpdatePopupOpen(false)}
        request={selectedRequest}
        statuses={statuses}
        statusesLoading={false}
        statusesError={false}
        onSave={handleSaveStatus}
        isSaving={isSaving}
      />
    </Box>
  );
}
