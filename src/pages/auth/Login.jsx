import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";

import GJ_Concierge_Light from "../../assets/images/GJ_Concierge_Light.svg";
import { api } from "../../api/auth";
import { getStaffByUserId, ensureStaffForUser } from "../../api/staff";
import { setStorageItem, removeStorageItem } from "../../utils/localStorageHandler";
import { STORAGE_KEYS } from "../../constants/storageKeys";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { MODULES } from "../../constants/modules";
import { toast } from "react-toastify";

const LOGIN_USERNAME_KEY = "login_username";

const validationSchema = Yup.object({
  username: Yup.string().required("Username or Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: typeof sessionStorage !== "undefined" ? (sessionStorage.getItem(LOGIN_USERNAME_KEY) || "") : "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => loginMutation.mutate(values),
  });

  const loginMutation = useMutation({
    mutationFn: api.login,
    onSuccess: async (res) => {
      const data = res?.data;
      if (!data?.access_token) {
        toast.error("Invalid login response");
        return;
      }
      // Set token immediately so follow-up API calls (getStaffByUserId, ensureStaffForUser) are authenticated
      setStorageItem(STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
      setStorageItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token ?? null);
      setStorageItem(STORAGE_KEYS.TENANT_ID, data.tenantId ?? null);
      setStorageItem(STORAGE_KEYS.LOCATION_ID, data.locationId ?? null);
      setStorageItem(STORAGE_KEYS.USER, {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        userType: data.userType,
        active: data.active,
        customerId: data.customerId ?? null,
      });
      try {
        let staff;
        try {
          staff = await getStaffByUserId(data.id);
        } catch (err) {
          if (err?.response?.status === 404 && data.tenantId && data.locationId) {
            staff = await ensureStaffForUser(data.id, data.tenantId, data.locationId);
          } else {
            throw err;
          }
        }
        if (!staff?.id && data.tenantId && data.locationId) {
          staff = await ensureStaffForUser(data.id, data.tenantId, data.locationId);
        }
        if (staff?.id) {
          try {
            sessionStorage.removeItem(LOGIN_USERNAME_KEY);
          } catch (_) {}
          handleLogin(data, staff);
          navigate(`/${MODULES.DASHBOARD}`);
        } else {
          removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
          removeStorageItem(STORAGE_KEYS.REFRESH_TOKEN);
          removeStorageItem(STORAGE_KEYS.USER);
          removeStorageItem(STORAGE_KEYS.TENANT_ID);
          removeStorageItem(STORAGE_KEYS.LOCATION_ID);
          if (formik.values.username) {
            try {
              sessionStorage.setItem(LOGIN_USERNAME_KEY, formik.values.username);
            } catch (_) {}
          }
          toast.error("No staff profile found. Contact admin.");
        }
      } catch (err) {
        removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
        removeStorageItem(STORAGE_KEYS.REFRESH_TOKEN);
        removeStorageItem(STORAGE_KEYS.USER);
        removeStorageItem(STORAGE_KEYS.TENANT_ID);
        removeStorageItem(STORAGE_KEYS.LOCATION_ID);
        if (formik.values.username) {
          try {
            sessionStorage.setItem(LOGIN_USERNAME_KEY, formik.values.username);
          } catch (_) {}
        }
        toast.error(err?.response?.status === 403
          ? "Access denied. Staff role required."
          : err?.response?.status === 404
          ? "No staff profile found. Contact admin."
          : err?.response?.data?.message || err?.message || "Failed to load staff profile.");
      }
    },
    onError: (err) => {
      if (formik.values.username) {
        try {
          sessionStorage.setItem(LOGIN_USERNAME_KEY, formik.values.username);
        } catch (_) {}
      }
      toast.error(err?.response?.data?.error_description || err?.message || "Login failed");
    },
  });

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          maxWidth: 380,
          p: 3,
          borderRadius: 3,
        }}
      >
        <Box textAlign="center" mb={2}>
          <img
            src={GJ_Concierge_Light}
            alt="GJ Concierge"
            style={{ height: 48, maxWidth: "100%" }}
          />
        </Box>

        <Typography variant="h6" fontWeight={600} gutterBottom>
          Staff Login
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Sign in to GJ Concierge Staff
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Box mb={2}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Email
            </Typography>
            <TextField
              fullWidth
              name="username"
              type="email"
              inputMode="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
              sx={{ "& .MuiInputBase-root": { minHeight: 48 } }}
            />
          </Box>

          <Box mb={3}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Password
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={{ "& .MuiInputBase-root": { minHeight: 48 } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((p) => !p)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loginMutation.isPending}
            sx={{ minHeight: 48, borderRadius: 2 }}
          >
            {loginMutation.isPending ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
