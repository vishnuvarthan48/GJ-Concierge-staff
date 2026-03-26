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
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { getStorageItem } from "../../utils/localStorageHandler";
import { STORAGE_KEYS } from "../../constants/storageKeys";
import { uploadAttachment } from "../../api/staff/attachment";

const UpdateStatusPopup = ({
  open,
  onClose,
  request,
  statuses = [],
  statusesLoading,
  statusesError,
  onSave,
  onAllSuccess,
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
  const [photoFiles, setPhotoFiles] = useState([]);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (open && primaryItem) {
      setSelectedStatus(primaryItem?.status ?? null);
      setComment("");
      setStatusError("");
      setPhotoFiles([]);
      setUploadError("");
    }
  }, [open, primaryItem]);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files || []);
    setPhotoFiles((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removePhoto = (index) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (items.length === 0) return;
    if (!selectedStatus?.id) {
      setStatusError("Status is required");
      return;
    }
    setStatusError("");
    setUploadError("");
    let attachmentIds = [];
    if (photoFiles.length > 0) {
      try {
        const results = await Promise.all(
          photoFiles.map((file) => uploadAttachment(file))
        );
        attachmentIds = results
          .filter((r) => r?.id)
          .map((r) => ({ attachment: { id: r.id } }));
      } catch (err) {
        setUploadError(err?.message || "Failed to upload image(s).");
        return;
      }
    }
    let completed = 0;
    const total = items.length;
    const checkDone = () => {
      completed++;
      if (completed >= total) {
        onAllSuccess?.();
        onClose();
      }
    };
    const attachments =
      attachmentIds.length > 0 ? attachmentIds : undefined;
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
        ...(attachments && { attachments }),
      };
      onSave?.(payload, checkDone);
    }
  };

  const handleClose = () => {
    setSelectedStatus(null);
    setComment("");
    setStatusError("");
    setPhotoFiles([]);
    setUploadError("");
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

            <Stack spacing={1}>
              <Typography variant="subtitle2" color="secondary">
                Attach image(s)
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<PhotoCameraIcon />}
                size="small"
                sx={{ alignSelf: "flex-start" }}
              >
                Add photos
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handlePhotoChange}
                />
              </Button>
              {photoFiles.length > 0 && (
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {photoFiles.map((file, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        bgcolor: "action.hover",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="caption" noWrap sx={{ maxWidth: 140 }}>
                        {file.name}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => removePhoto(index)}
                        sx={{ p: 0.25 }}
                        aria-label="Remove"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              )}
              {uploadError && (
                <FormHelperText error>{uploadError}</FormHelperText>
              )}
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
