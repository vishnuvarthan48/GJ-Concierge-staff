import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Autocomplete,
} from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Html5Qrcode } from "html5-qrcode";
import { api } from "../../api/staff/requests";
import { MODULES } from "../../constants/modules";
import { QUERY_KEYS } from "../../constants/queryKeys";

const toArray = (x) => (Array.isArray(x) ? x : (x?.list ?? []));

/** Parse room ID from QR content (URL with roomId param or raw UUID). */
function parseRoomIdFromQr(content) {
  if (!content || typeof content !== "string") return null;
  const s = content.trim();
  const uuidRegex =
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
  const match = s.match(uuidRegex);
  if (match) return match[0];
  const roomParam =
    /[?&]roomId=([^&]+)/i.exec(s) || /[?&]room=([^&]+)/i.exec(s);
  if (roomParam) return roomParam[1].trim();
  return s.length < 50 ? s : null;
}

export default function CreateServiceRequest() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const queryClient = useQueryClient();
  const [blockId, setBlockId] = useState("");
  const [floorId, setFloorId] = useState("");
  const [roomId, setRoomId] = useState(state?.roomId ?? "");
  const [roomIdFromQr, setRoomIdFromQr] = useState(state?.roomId ?? "");
  const [serviceId, setServiceId] = useState("");
  const [comment, setComment] = useState("");
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const qrScannerRef = useRef(null);
  const scannerRef = useRef(null);

  const { data: blocksData, isLoading: blocksLoading } = useQuery({
    queryKey: [QUERY_KEYS.STAFF, "blocks"],
    queryFn: () => api.getBlocksForStaff(),
  });
  const blocks = toArray(blocksData);

  const { data: floorsData, isLoading: floorsLoading } = useQuery({
    queryKey: [QUERY_KEYS.STAFF, "floors", blockId],
    queryFn: () => api.getFloorsByBlock(blockId),
    enabled: !!blockId,
  });
  const floors = toArray(floorsData);

  const { data: roomsData, isLoading: roomsLoading } = useQuery({
    queryKey: [QUERY_KEYS.STAFF, "rooms-by-floor", floorId],
    queryFn: () => api.getRoomsByFloor(floorId),
    enabled: !!floorId,
  });
  const rooms = toArray(roomsData);

  const { data: servicesData = [], isLoading: servicesLoading } = useQuery({
    queryKey: [QUERY_KEYS.STAFF, "services"],
    queryFn: () => api.getServicesForLocation(),
  });
  const services = toArray(servicesData);

  useEffect(() => {
    if (state?.roomId) {
      setRoomId(state.roomId);
      setRoomIdFromQr(state.roomId);
    }
  }, [state?.roomId]);

  useEffect(() => {
    if (!blockId) setFloorId("");
    if (!floorId) setRoomId("");
  }, [blockId, floorId]);

  const blockOption = blocks.find((b) => b.id === blockId) || null;
  const floorOption = floors.find((f) => f.id === floorId) || null;
  const roomOption = rooms.find((r) => r.id === roomId) || null;
  const serviceOption = services.find((s) => s.id === serviceId) || null;

  const applyRoomFromSelection = (id) => {
    setRoomId(id || "");
    setRoomIdFromQr("");
  };

  const applyRoomFromQr = (id) => {
    setRoomId(id || "");
    setRoomIdFromQr(id || "");
    setBlockId("");
    setFloorId("");
  };

  const createMutation = useMutation({
    mutationFn: (payload) => api.createServiceRequestByStaff(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SERVICE_REQUESTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SERVICE_REQUEST_COUNT],
      });
      toast.success("Service request created.");
      navigate(`/${MODULES.REQUESTS}#service`);
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create request.",
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalRoomId = roomId || (roomIdFromQr && roomIdFromQr.trim()) || null;
    if (!finalRoomId || !serviceId) {
      toast.error("Please select a room and a service.");
      return;
    }
    createMutation.mutate({
      roomId: finalRoomId,
      serviceId,
      comment: comment || undefined,
    });
  };

  const handleOpenScan = () => setScanDialogOpen(true);

  const handleCloseScan = async () => {
    setScanDialogOpen(false);
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (_) {}
      scannerRef.current = null;
    }
  };

  const handleScanSuccess = (decodedText) => {
    const id = parseRoomIdFromQr(decodedText);
    if (id) {
      applyRoomFromQr(id);
      toast.success("Room captured from QR.");
      handleCloseScan();
    } else {
      toast.error("QR did not contain a valid room ID.");
    }
  };

  useEffect(() => {
    if (!scanDialogOpen) return;
    const id = setTimeout(async () => {
      const el = document.getElementById("qr-reader");
      if (!el) return;
      try {
        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: "environment" },
          { fps: 5, qrbox: { width: 250, height: 250 } },
          (decodedText) => handleScanSuccess(decodedText),
          () => {},
        );
      } catch (err) {
        toast.error("Camera access failed.");
      }
    }, 300);
    return () => {
      clearTimeout(id);
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [scanDialogOpen]);

  const loading = blocksLoading || servicesLoading;
  const finalRoomId = roomId || (roomIdFromQr && roomIdFromQr.trim()) || "";

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Create service request
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Select room (Block → Floor → Room) or scan QR
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
            <Autocomplete
              size="small"
              options={blocks}
              value={blockOption}
              onChange={(_, value) => {
                setBlockId(value?.id ?? "");
                setFloorId("");
                setRoomId("");
              }}
              getOptionLabel={(opt) => opt?.name ?? ""}
              isOptionEqualToValue={(a, b) => a?.id === b?.id}
              renderInput={(params) => (
                <TextField {...params} placeholder="Block" />
              )}
              loading={blocksLoading}
            />
            <Autocomplete
              size="small"
              options={floors}
              value={floorOption}
              onChange={(_, value) => {
                setFloorId(value?.id ?? "");
                setRoomId("");
              }}
              getOptionLabel={(opt) => opt?.name ?? ""}
              isOptionEqualToValue={(a, b) => a?.id === b?.id}
              renderInput={(params) => (
                <TextField {...params} placeholder="Floor" />
              )}
              loading={floorsLoading}
              disabled={!blockId}
            />
            <Autocomplete
              size="small"
              options={rooms}
              value={roomOption}
              onChange={(_, value) => applyRoomFromSelection(value?.id ?? "")}
              getOptionLabel={(opt) => opt?.name ?? ""}
              isOptionEqualToValue={(a, b) => a?.id === b?.id}
              renderInput={(params) => (
                <TextField {...params} placeholder="Room" />
              )}
              loading={roomsLoading}
              disabled={!floorId}
            />
          </Box>

          <Button
            type="button"
            variant="outlined"
            size="small"
            startIcon={<QrCodeScannerIcon />}
            onClick={handleOpenScan}
            sx={{ mb: 2 }}
          >
            Scan QR in room
          </Button>

          <Divider sx={{ my: 2 }} />

          <Autocomplete
            size="small"
            options={services}
            value={serviceOption}
            onChange={(_, value) => setServiceId(value?.id ?? "")}
            getOptionLabel={(opt) => opt?.name ?? ""}
            isOptionEqualToValue={(a, b) => a?.id === b?.id}
            renderInput={(params) => (
              <TextField {...params} placeholder="Service" required />
            )}
            loading={servicesLoading}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            size="small"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comment (optional)"
            multiline
            rows={2}
            sx={{ mb: 2 }}
          />
          {createMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {createMutation.error?.response?.data?.message ||
                createMutation.error?.message}
            </Alert>
          )}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isPending || !finalRoomId || !serviceId}
            >
              {createMutation.isPending ? "Creating…" : "Create request"}
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate(-1)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
          </Box>
        </Paper>
      )}

      <Dialog
        open={scanDialogOpen}
        onClose={handleCloseScan}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Scan room QR</DialogTitle>
        <DialogContent>
          <Box id="qr-reader" ref={qrScannerRef} sx={{ minHeight: 200 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseScan}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
