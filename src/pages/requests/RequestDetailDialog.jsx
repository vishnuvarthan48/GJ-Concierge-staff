import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  StepConnector,
  CircularProgress,
  Button,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { useStaffServiceRequestDetail } from "../../query-hooks/requests/useStaffServiceRequestDetail";
import { useStaffProductRequestDetail } from "../../query-hooks/requests/useStaffProductRequestDetail";

const STATUS_COLOR_MAP_SERVICE = {
  NEW: "info",
  IN_PROGRESS: "warning",
  INPROGRESS: "warning",
  ASSIGNED: "warning",
  DONE: "success",
  COMPLETED: "success",
  CLOSED: "success",
  CANCELLED: "error",
  CANCELED: "error",
};

const STATUS_COLOR_MAP_PRODUCT = {
  NEW: "info",
  ASSIGNED: "warning",
  PROCESSED: "warning",
  DELIVERED: "success",
  NOTDELIVERED: "success",
  CANCELLED: "error",
  CANCELED: "error",
};

const getStatusColor = (statusName, isProduct) => {
  if (!statusName) return "default";
  const key = String(statusName).toUpperCase().replace(/\s/g, "_");
  const map = isProduct ? STATUS_COLOR_MAP_PRODUCT : STATUS_COLOR_MAP_SERVICE;
  return map[key] ?? "default";
};

const formatDate = (ts) => (ts == null ? "—" : dayjs(ts).format("DD MMM YYYY, HH:mm"));

const getAttachmentUrl = (at) =>
  at?.attachment?.mediaUrl ?? at?.attachment?.mediaURL ?? at?.mediaUrl ?? at?.mediaURL ?? null;

const DetailRow = ({ label, value }) => (
  <Stack direction="row" spacing={2} sx={{ mb: 1.5 }}>
    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120, fontSize: "0.875rem" }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>{value ?? "—"}</Typography>
  </Stack>
);

export default function RequestDetailDialog({ open, onClose, type, requestId, listRow }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isService = type === "service";
  const id = requestId ?? (isService ? listRow?.id : listRow?.items?.[0]?.id ?? listRow?.id);

  const { data: serviceData, isLoading: serviceLoading, error: serviceError } = useStaffServiceRequestDetail(id, {
    enabled: open && isService && !!id,
  });
  const { data: productData, isLoading: productLoading, error: productError } = useStaffProductRequestDetail(id, {
    enabled: open && !isService && !!id,
  });

  const loading = isService ? serviceLoading : productLoading;
  const error = isService ? serviceError : productError;
  const data = isService ? serviceData : productData;

  const room = data?.room;
  const block = room?.floorId?.blockId;
  const floor = room?.floorId;
  const blockAndFloor =
    block?.name && floor?.name ? `${block.name}, ${floor.name}` : floor?.name || block?.name || "—";

  const assignedToLabel = (() => {
    const at = data?.assignedTo;
    if (!at) return "—";
    if (typeof at !== "object") return String(at);
    const u = at?.user;
    if (!u) return "—";
    return [u.firstName, u.lastName].filter(Boolean).join(" ") || u.name || "—";
  })();

  const histories = Array.isArray(data?.histories) ? [...data.histories] : [];
  histories.sort((a, b) => {
    const tA = a.createdDate ?? a.createdOn ?? 0;
    const tB = b.createdDate ?? b.createdOn ?? 0;
    if (tA !== tB) return tA - tB;
    const posA = a.status?.position ?? 999;
    const posB = b.status?.position ?? 999;
    return posA - posB;
  });

  const title = isService
    ? (data?.service?.name || listRow?.service?.name || "Service request")
    : (() => {
        const groupItems = data?.groupItems ?? (data ? [data] : []);
        const names = groupItems.map((i) => i?.product?.name).filter(Boolean).join(", ");
        return names || listRow?.productNames || data?.product?.name || "Product request";
      })();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: isMobile
          ? { m: 0, maxHeight: "100%", borderRadius: 0 }
          : { m: 2, maxHeight: "calc(100vh - 32px)", borderRadius: 3 },
      }}
    >
      <DialogTitle sx={{ py: 2, fontSize: "1.125rem" }}>
        {title}
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 0 }}>
        {loading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Typography color="error" sx={{ py: 2 }}>
            {error?.message || "Failed to load request details"}
          </Typography>
        )}
        {!loading && !error && data && (
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Request details
              </Typography>
              {!isService && data?.groupItems?.length > 1 && (
                <DetailRow
                  label="Products"
                  value={data.groupItems.map((i) => i?.product?.name).filter(Boolean).join(", ")}
                />
              )}
              {isService && <DetailRow label="Request" value={data?.service?.name} />}
              {!isService && data?.groupItems?.length <= 1 && <DetailRow label="Product" value={data?.product?.name} />}
              <DetailRow label="Room" value={room?.name} />
              <DetailRow label="Block & floor" value={blockAndFloor} />
              <DetailRow label="Requested on" value={formatDate(data?.createdOn)} />
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120, fontSize: "0.875rem" }}>
                  Status
                </Typography>
                <Chip
                  label={data?.status?.displayName || data?.status?.name || "—"}
                  color={getStatusColor(data?.status?.name ?? data?.status?.displayName, !isService)}
                  size="small"
                />
              </Stack>
              <DetailRow label="Requested by" value={data?.userName} />
              <DetailRow label="Comment" value={data?.comment} />
              <DetailRow label="Assigned to" value={assignedToLabel} />
            </Paper>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Request tracker
              </Typography>
              {histories.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                  No history yet.
                </Typography>
              ) : (
                <Stepper
                  orientation="vertical"
                  connector={
                    <StepConnector
                      sx={{
                        "& .MuiStepConnector-line": {
                          borderColor: "success.main",
                          borderLeftWidth: 2,
                        },
                      }}
                    />
                  }
                  sx={{
                    "& .MuiStepLabel-label": { fontSize: "0.875rem" },
                    "& .MuiStepIcon-root": { color: "success.main" },
                    "& .MuiStepIcon-completed": { color: "success.main" },
                    "& .MuiStepIcon-active": { color: "success.main" },
                    "& .MuiStepIcon-text": { fill: "white", fontWeight: 700 },
                  }}
                >
                  {histories.map((h, index) => {
                    const stepComment =
                      isService && index === 0 && data?.comment ? data.comment || h?.comment : h?.comment;
                    return (
                      <Step key={h.id} active completed={index < histories.length - 1}>
                        <StepLabel>
                          {h?.status?.displayName || h?.status?.name || "Update"} —{" "}
                          {formatDate(h?.createdDate ?? h?.createdOn)}
                        </StepLabel>
                        <StepContent>
                          {stepComment && (
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                              {stepComment}
                            </Typography>
                          )}
                          {Array.isArray(h?.attachments) && h.attachments.length > 0 && (
                            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                              {h.attachments.map((at, i) => {
                                const url = getAttachmentUrl(at);
                                if (!url) return null;
                                return (
                                  <Box
                                    key={at?.id ?? i}
                                    component="a"
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                      display: "block",
                                      width: 72,
                                      height: 72,
                                      borderRadius: 1,
                                      overflow: "hidden",
                                      border: "1px solid",
                                      borderColor: "divider",
                                      flexShrink: 0,
                                    }}
                                  >
                                    <Box
                                      component="img"
                                      src={url}
                                      alt=""
                                      sx={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                    />
                                  </Box>
                                );
                              })}
                            </Stack>
                          )}
                        </StepContent>
                      </Step>
                    );
                  })}
                </Stepper>
              )}
            </Paper>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
