import { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Avatar,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Typography,
  Divider,
  Switch,
  FormControlLabel,
  TextField,
  Alert,
  InputAdornment,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GJ_Concierge_Dark from "../../assets/images/GJ_Concierge_Dark.svg";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useThemeMode } from "../../hooks/useThemeMode";
import { useMutation } from "@tanstack/react-query";
import { api as authApi } from "../../api/auth";
import { removeStorageItem } from "../../utils/localStorageHandler";
import { STORAGE_KEYS } from "../../constants/storageKeys";

function getStaffDisplayName(user, staff) {
  if (staff?.user?.firstName != null || staff?.user?.lastName != null) {
    return (
      [staff.user.firstName, staff.user.lastName].filter(Boolean).join(" ") ||
      staff.user.email ||
      "Staff"
    );
  }
  if (user?.firstName != null || user?.lastName != null) {
    return (
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.email ||
      "Staff"
    );
  }
  return user?.email || "Staff";
}

export default function Header() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { mode, toggleTheme } = useThemeMode();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [avatarAnchor, setAvatarAnchor] = useState(null);
  const [settingsAnchor, setSettingsAnchor] = useState(null);
  const [changeDialogOpen, setChangeDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const user = auth?.user;
  const staff = auth?.staff;
  const staffName = getStaffDisplayName(user, staff);
  const departmentName = staff?.department?.name ?? "—";
  const organizationName =
    staff?.tenant?.name ??
    staff?.location?.tenant?.name ??
    user?.organizationName ??
    user?.tenantName ??
    "—";
  const imageUrl =
    staff?.user?.imageUrl ??
    staff?.imageUrl ??
    user?.imageUrl ??
    user?.profileImageUrl ??
    null;
  const secondaryText = [organizationName, departmentName]
    .filter(Boolean)
    .filter((s) => s !== "—")
    .join(" · ") || "—";

  const handleLogoutClick = () => {
    setAvatarAnchor(null);
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    auth?.handleLogout?.();
    setLogoutDialogOpen(false);
    navigate("/", { replace: true });
  };

  const openAvatar = Boolean(avatarAnchor);
  const openSettings = Boolean(settingsAnchor);
  const PASSWORD_RULE =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

  const changePasswordMutation = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      setPasswordError("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setChangeDialogOpen(false);
      setSettingsAnchor(null);
      removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
      removeStorageItem(STORAGE_KEYS.REFRESH_TOKEN);
      removeStorageItem(STORAGE_KEYS.USER);
      removeStorageItem(STORAGE_KEYS.TENANT_ID);
      removeStorageItem(STORAGE_KEYS.LOCATION_ID);
      removeStorageItem(STORAGE_KEYS.STAFF_ID);
      removeStorageItem(STORAGE_KEYS.STAFF);
      setSuccessDialogOpen(true);
    },
    onError: (error) => {
      setPasswordError(
        error?.response?.data?.status?.message ||
          error?.response?.data?.message ||
          error?.response?.data?.error_description ||
          error?.message ||
          "Failed to change password."
      );
    },
  });

  const handleChangePassword = () => {
    if (!currentPassword) {
      setPasswordError("Current password is required");
      return;
    }
    if (!newPassword) {
      setPasswordError("New password is required");
      return;
    }
    if (!PASSWORD_RULE.test(newPassword)) {
      setPasswordError(
        "Use at least 8 chars with uppercase, lowercase, number and special character."
      );
      return;
    }
    if (currentPassword === newPassword) {
      setPasswordError("New password cannot be same as old password.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError("New password and confirm password must match.");
      return;
    }
    setPasswordError("");
    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          px: 1.75,
          py: 0.75,
          mb: 1,
          minHeight: 60,
          borderRadius: 0,
          border: "none",
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 58%, ${theme.palette.secondary.main} 100%)`,
          color: "primary.contrastText",
          overflow: "hidden",
          boxShadow: (theme) =>
            `0 14px 30px ${theme.palette.mode === "dark" ? "rgba(0,0,0,0.35)" : "rgba(15,110,140,0.3)"}`,
          "&::before": {
            content: '""',
            position: "absolute",
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            top: -85,
            right: -45,
          },
        }}
      >
        <Toolbar
          disableGutters
          sx={{ minHeight: 60, justifyContent: "space-between", position: "relative", zIndex: 1 }}
        >
          <img
            src={GJ_Concierge_Dark}
            alt="GJ Concierge Staff"
            style={{ height: 38, width: "auto" }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <IconButton
              size="large"
              onClick={(e) => setSettingsAnchor(e.currentTarget)}
              aria-label="Settings"
              sx={{
                minWidth: 40,
                minHeight: 40,
                color: "inherit",
                bgcolor: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.18)",
                backdropFilter: "blur(8px)",
                "&:active": { bgcolor: "rgba(255,255,255,0.22)" },
              }}
            >
              <SettingsIcon />
            </IconButton>
            <IconButton
              size="large"
              onClick={(e) => setAvatarAnchor(e.currentTarget)}
              aria-label="Profile"
              sx={{
                minWidth: 40,
                minHeight: 40,
                p: 0,
                color: "inherit",
                bgcolor: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.18)",
                backdropFilter: "blur(8px)",
                "&:active": { bgcolor: "rgba(255,255,255,0.22)" },
              }}
            >
              <Avatar
                src={imageUrl || undefined}
                sx={{ width: 34, height: 34, bgcolor: "rgba(255,255,255,0.24)", color: "inherit" }}
              >
                {staffName.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Popover
        open={openAvatar}
        anchorEl={avatarAnchor}
        onClose={() => setAvatarAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            minWidth: 260,
            mt: 1.5,
            borderRadius: 2,
            boxShadow: (t) => t.shadows[8],
            overflow: "hidden",
          },
        }}
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={imageUrl || undefined}
              sx={{
                width: 48,
                height: 48,
                bgcolor: "primary.main",
                flexShrink: 0,
              }}
            >
              {staffName.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" fontWeight={700} noWrap>
                {staffName}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.25 }}
                noWrap
              >
                {secondaryText}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ borderColor: "primary.main", opacity: 0.5 }} />
        <List dense disablePadding sx={{ py: 0.5 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setAvatarAnchor(null)}
              sx={{ py: 1.25 }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "text.secondary" }}>
                <PersonOutlineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="View Profile" primaryTypographyProps={{ variant: "body2" }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogoutClick} sx={{ py: 1.25 }}>
              <ListItemIcon sx={{ minWidth: 40, color: "text.secondary" }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" primaryTypographyProps={{ variant: "body2" }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Popover>

      <Popover
        open={openSettings}
        anchorEl={settingsAnchor}
        onClose={() => {
          setSettingsAnchor(null);
          setPasswordError("");
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { minWidth: 220, p: 2, mt: 1.5 } }}
      >
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Appearance
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={mode === "dark"}
              onChange={() => {
                toggleTheme();
              }}
              color="primary"
            />
          }
          label="Dark mode"
        />
        <Divider sx={{ my: 1.5 }} />
        <Button
          fullWidth
          variant="outlined"
          onClick={() => {
            setPasswordError("");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            setChangeDialogOpen(true);
          }}
        >
          Change Password
        </Button>
      </Popover>

      <Dialog
        open={changeDialogOpen}
        onClose={() => {
          setChangeDialogOpen(false);
          setPasswordError("");
        }}
        fullScreen={false}
        fullWidth
        maxWidth="xs"
      >
        <Box component="form" onSubmit={(e) => {
          e.preventDefault();
          handleChangePassword();
        }}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {passwordError && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {passwordError}
            </Alert>
          )}
          <Typography variant="subtitle2" color="secondary" sx={{ mb: 0.5 }}>
            Current Password
          </Typography>
          <TextField
            fullWidth
            size="small"
            type={showCurrentPassword ? "text" : "password"}
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            sx={{ mb: 1 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowCurrentPassword((p) => !p)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="subtitle2" color="secondary" sx={{ mb: 0.5 }}>
            New Password
          </Typography>
          <TextField
            fullWidth
            size="small"
            type={showNewPassword ? "text" : "password"}
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 1 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowNewPassword((p) => !p)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="subtitle2" color="secondary" sx={{ mb: 0.5 }}>
            Confirm New Password
          </Typography>
          <TextField
            fullWidth
            size="small"
            type={showConfirmNewPassword ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowConfirmNewPassword((p) => !p)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.75, display: "block" }}
          >
            8+ chars, uppercase, lowercase, number and special character.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setChangeDialogOpen(false)}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={changePasswordMutation.isPending}
          >
            {changePasswordMutation.isPending ? "Updating..." : "Submit"}
          </Button>
        </DialogActions>
        </Box>
      </Dialog>

      <Dialog
        open={successDialogOpen}
        onClose={() => {}}
        disableEscapeKeyDown
        fullWidth
        maxWidth="xs"
      >
        <DialogContent sx={{ textAlign: "center", pt: 4 }}>
          <CheckCircleRoundedIcon color="success" sx={{ fontSize: 84, mb: 1 }} />
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Password Reset Successfully
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Password reset successfully. Login again to continue.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              setSuccessDialogOpen(false);
              auth?.handleLogout?.();
              navigate("/", { replace: true });
            }}
          >
            Login again
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        fullScreen={false}
        PaperProps={{ sx: { m: 2, maxWidth: "calc(100% - 32px)" } }}
      >
        <DialogTitle>Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setLogoutDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleLogoutConfirm}
            color="primary"
            variant="contained"
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
