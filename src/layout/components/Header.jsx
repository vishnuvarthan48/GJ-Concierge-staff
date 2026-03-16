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
} from "@mui/material";
import GJ_Concierge_Light from "../../assets/images/GJ_Concierge_Light.svg";
import GJ_Concierge_Dark from "../../assets/images/GJ_Concierge_Dark.svg";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useThemeMode } from "../../hooks/useThemeMode";

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
    navigate("/login", { replace: true });
  };

  const openAvatar = Boolean(avatarAnchor);
  const openSettings = Boolean(settingsAnchor);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          px: 2,
          py: 1,
          minHeight: 58,
          borderRadius: 0,
          background: "background.paper",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar
          disableGutters
          sx={{ minHeight: 58, justifyContent: "space-between" }}
        >
          <img
            src={mode === "dark" ? GJ_Concierge_Dark : GJ_Concierge_Light}
            alt="GJ Concierge Staff"
            style={{ height: 38, width: "auto" }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <IconButton
              size="large"
              onClick={(e) => setSettingsAnchor(e.currentTarget)}
              aria-label="Settings"
              sx={{ minWidth: 44, minHeight: 44 }}
            >
              <SettingsIcon />
            </IconButton>
            <IconButton
              size="large"
              onClick={(e) => setAvatarAnchor(e.currentTarget)}
              aria-label="Profile"
              sx={{ minWidth: 44, minHeight: 44, p: 0 }}
            >
              <Avatar
                src={imageUrl || undefined}
                sx={{ width: 36, height: 36, bgcolor: "primary.main" }}
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
        onClose={() => setSettingsAnchor(null)}
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
      </Popover>

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
