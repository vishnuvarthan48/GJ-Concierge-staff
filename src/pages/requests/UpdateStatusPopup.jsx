import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  Typography,
  TextField,
  Autocomplete,
  Stack,
  FormHelperText,
  CircularProgress,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getStorageItem } from "../../utils/localStorageHandler";
import { STORAGE_KEYS } from "../../constants/storageKeys";

const UpdateStatusPopup = ({
  open,
  onClose,
  request,
  statuses = [],
  statusesLoading,
  statusesError,
  onSave,
  isSaving,
}) => {
  const currentUser = getStorageItem(STORAGE_KEYS.USER);

  const items = request?.items && Array.isArray(request.items)
    ? request.items
    : request ? [request] : [];
  const primaryItem = items[0];
  const currentStatusFromRequest = primaryItem?.status;
  const currentStatusFromList =
    statuses.find((s) => s.id === currentStatusFromRequest?.id) ??
    currentStatusFromRequest;
  const currentPosition =
    currentStatusFromList?.position ?? currentStatusFromRequest?.position ?? 0;

  const forwardStatuses = useMemo(
    () => statuses.filter((s) => (s.position ?? 0) >= currentPosition),
    [statuses, currentPosition]
  );

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [comment, setComment] = useState("");
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    if (open && primaryItem) {
      setSelectedStatus(primaryItem?.status ?? null);
      setComment("");
      setStatusError("");
    }
  }, [open, primaryItem]);

  const handleSave = async () => {
    if (items.length === 0) return;
    if (!selectedStatus?.id) {
      setStatusError("Status is required");
      return;
    }
    setStatusError("");
    let completed = 0;
    const total = items.length;
    const checkDone = () => {
      completed++;
      if (completed >= total) onClose();
    };
    for (const req of items) {
      if (!req?.id) {
        checkDone();
        continue;
      }
      const payload = {
        id: req.id,
        status: { id: selectedStatus.id },
        comment: comment.trim() || undefined,
        doneBy: currentUser?.id ? { id: currentUser.id } : undefined,
      };
      onSave?.(payload, checkDone);
    }
  };

  const handleClose = () => {
    setSelectedStatus(null);
    setComment("");
    setStatusError("");
    onClose();
  };

  const isValid = !!selectedStatus?.id;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          m: 2,
          maxHeight: "calc(100vh - 32px)",
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          pr: 6,
          py: 2,
          fontSize: "1.125rem",
        }}
      >
        Update status
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            minWidth: 44,
            minHeight: 44,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 0, pb: 3 }}>
        {statusesError && (
          <Typography color="error" sx={{ py: 2 }}>
            Failed to load statuses.
          </Typography>
        )}
        {statusesLoading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}
        {!statusesLoading && !statusesError && (
          <Stack spacing={3} sx={{ pt: 1 }}>
            <Stack spacing={1}>
              <Typography variant="subtitle2" color="secondary">
                Select status
              </Typography>
              <Autocomplete
                size="small"
                options={forwardStatuses}
                value={selectedStatus}
                onChange={(_, newValue) => {
                  setSelectedStatus(newValue);
                  setStatusError("");
                }}
                getOptionLabel={(option) =>
                  option?.displayName || option?.name || ""
                }
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select status"
                    error={!!statusError}
                    sx={{ "& .MuiInputBase-root": { minHeight: 48 } }}
                  />
                )}
                clearOnEscape
              />
              {statusError && (
                <FormHelperText error>{statusError}</FormHelperText>
              )}
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2" color="secondary">
                Comments
              </Typography>
              <TextField
                multiline
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="Add a note (optional)"
                sx={{
                  "& .MuiInputBase-root": {
                    alignItems: "flex-start",
                    minHeight: 120,
                  },
                  "& textarea": { boxSizing: "border-box" },
                }}
              />
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleClose}
                fullWidth
                sx={{ minHeight: 48 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={!isValid || isSaving}
                fullWidth
                sx={{ minHeight: 48 }}
              >
                {isSaving ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                    Saving…
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </Stack>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStatusPopup;
