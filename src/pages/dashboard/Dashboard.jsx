import { useMemo, useState } from "react";
import { Box, Card, CardContent, Typography, Grid, Alert, Button } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BuildIcon from "@mui/icons-material/Build";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import { MODULES } from "../../constants/modules";
import {
  useStaffServiceRequestCount,
  useStaffProductRequestCount,
} from "../../query-hooks/requests/useStaffRequestCount";
import { useStaffServiceRequestList } from "../../query-hooks/requests/useStaffServiceRequestList";
import { useStaffProductRequestList } from "../../query-hooks/requests/useStaffProductRequestList";
import { useStaffServiceRequestStatuses } from "../../query-hooks/requests/useStaffServiceRequestStatuses";
import { useStaffProductRequestStatuses } from "../../query-hooks/requests/useStaffProductRequestStatuses";
import { useUpdateStaffServiceRequestStatus } from "../../query-hooks/requests/useUpdateStaffServiceRequestStatus";
import { useUpdateStaffProductRequestStatus } from "../../query-hooks/requests/useUpdateStaffProductRequestStatus";
import { useAuth } from "../../hooks/useAuth";
import RequestCard from "../requests/RequestCard";
import RequestDetailDialog from "../requests/RequestDetailDialog";
import UpdateStatusPopup from "../requests/UpdateStatusPopup";

const SummaryCard = ({ title, count, icon: Icon, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      cursor: "pointer",
      borderRadius: 2,
      "&:active": { opacity: 0.95 },
      height: "100%",
    }}
  >
    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
      <Box display="flex" alignItems="center" gap={1.5}>
        <Box
          sx={{
            width: 48,
            height: 48,
            minWidth: 48,
            borderRadius: 2,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon sx={{ fontSize: 24 }} />
        </Box>
        <Box flex={1} minWidth={0}>
          <Typography variant="caption" color="text.secondary" display="block">
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={700}>
            {count}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRequest, setDetailRequest] = useState(null);
  const [detailType, setDetailType] = useState("service");
  const [updatePopupOpen, setUpdatePopupOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [updateType, setUpdateType] = useState("service");

  const {
    data: serviceCount,
    isLoading: serviceCountLoading,
    isError: serviceCountError,
  } = useStaffServiceRequestCount();
  const {
    data: productCount,
    isLoading: productCountLoading,
    isError: productCountError,
  } = useStaffProductRequestCount();
  const { data: serviceList = [] } = useStaffServiceRequestList();
  const { data: productList = [] } = useStaffProductRequestList();
  const {
    data: serviceStatuses = [],
    isLoading: serviceStatusesLoading,
    error: serviceStatusesError,
  } = useStaffServiceRequestStatuses();
  const {
    data: productStatusesData,
    isLoading: productStatusesLoading,
    error: productStatusesError,
  } = useStaffProductRequestStatuses();
  const productStatuses = Array.isArray(productStatusesData)
    ? productStatusesData
    : productStatusesData?.list ?? [];
  const serviceUpdateMutation = useUpdateStaffServiceRequestStatus();
  const productUpdateMutation = useUpdateStaffProductRequestStatus();

  const totalService = serviceCount?.totalCount ?? 0;
  const totalProduct = productCount?.totalCount ?? 0;
  const total = totalService + totalProduct;
  const countsLoading = serviceCountLoading || productCountLoading;
  const countsError = serviceCountError || productCountError;

  const goToRequests = (hash = "") =>
    navigate(`/${MODULES.REQUESTS}${hash ? `#${hash}` : ""}`);

  const lastRequest = useMemo(() => {
    const serviceEntries = (serviceList || []).map((r) => ({
      type: "service",
      row: r,
      date: r?.updatedDate ?? 0,
    }));
    const productGroups = new Map();
    (productList || []).forEach((row) => {
      const key = row?.requestGroupId || row?.id;
      if (!productGroups.has(key)) productGroups.set(key, []);
      productGroups.get(key).push(row);
    });
    const productEntries = Array.from(productGroups.values()).map((items) => ({
      type: "product",
      row: {
        items,
        id: items[0]?.id,
        productNames: items.map((r) => r?.product?.name).filter(Boolean).join(", ") || "—",
        room: items[0]?.room,
        status: items[0]?.status,
        userName: items[0]?.userName,
        updatedDate: items[0]?.updatedDate,
      },
      date: items[0]?.updatedDate ?? 0,
    }));
    const merged = [...serviceEntries, ...productEntries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return merged[0] ?? null;
  }, [serviceList, productList]);

  const isRecentClosed =
    lastRequest?.type === "service"
      ? String(lastRequest?.row?.status?.name || "").toUpperCase() === "CLOSED"
      : lastRequest?.row?.items?.every(
          (r) =>
            String(r?.status?.name || "").toUpperCase() === "DELIVERED" ||
            String(r?.status?.name || "").toUpperCase() === "NOTDELIVERED"
        ) ?? false;

  const handleRecentCardClick = () => {
    if (!lastRequest) return;
    setDetailType(lastRequest.type);
    setDetailRequest(lastRequest.row);
    setDetailOpen(true);
  };

  const handleRecentUpdateClick = () => {
    if (!lastRequest) return;
    setUpdateType(lastRequest.type);
    setSelectedRequest(
      lastRequest.type === "product" ? { items: lastRequest.row.items } : lastRequest.row
    );
    setUpdatePopupOpen(true);
  };

  const handleSaveStatus = (payload, onSuccess) => {
    if (updateType === "service") {
      serviceUpdateMutation.mutate(payload, { onSuccess: () => onSuccess?.() });
    } else {
      productUpdateMutation.mutate(payload, { onSuccess: () => onSuccess?.() });
    }
  };

  const statuses = updateType === "service" ? serviceStatuses : productStatuses;
  const statusesLoading =
    updateType === "service" ? serviceStatusesLoading : productStatusesLoading;
  const statusesError =
    updateType === "service" ? !!serviceStatusesError : !!productStatusesError;
  const isSaving =
    updateType === "service"
      ? serviceUpdateMutation.isPending
      : productUpdateMutation.isPending;

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontSize: "1.0625rem" }}>
        Welcome, {user?.firstName || user?.email || "Staff"}
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => navigate(`/${MODULES.CREATE_REQUEST}`)}
        sx={{ mb: 2 }}
      >
        Create service request
      </Button>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <SummaryCard
            title="Total Requests"
            count={countsLoading ? "…" : countsError ? "—" : total}
            icon={AssignmentIcon}
            onClick={() => goToRequests()}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <SummaryCard
            title="Service Requests"
            count={serviceCountLoading ? "…" : serviceCountError ? "—" : totalService}
            icon={BuildIcon}
            onClick={() => goToRequests("service")}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <SummaryCard
            title="Product Requests"
            count={productCountLoading ? "…" : productCountError ? "—" : totalProduct}
            icon={ShoppingCartIcon}
            onClick={() => goToRequests("products")}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.5,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Recent requests
          </Typography>
          <Button variant="outlined" size="small" onClick={() => goToRequests()}>
            View all
          </Button>
        </Box>
        {lastRequest ? (
          <RequestCard
            type={lastRequest.type}
            row={lastRequest.row}
            isClosed={isRecentClosed}
            onCardClick={handleRecentCardClick}
            onUpdateClick={handleRecentUpdateClick}
          />
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            No recent requests
          </Typography>
        )}
      </Box>

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
        statusesLoading={statusesLoading}
        statusesError={statusesError}
        onSave={handleSaveStatus}
        isSaving={isSaving}
      />

      {countsError && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Could not load request counts. Check your connection or try refreshing.
        </Alert>
      )}
    </Box>
  );
};

export default Dashboard;
