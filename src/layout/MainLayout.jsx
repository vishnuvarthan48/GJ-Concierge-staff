import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import ProtectedRoute from "../components/common/ProtectedRoute";

const MainLayout = () => {
  return (
    <ProtectedRoute>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100dvh",
          pb: 0,
          bgcolor: "background.default",
        }}
      >
        <Header />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 1.25, sm: 1.5 },
            pb: { xs: 10, sm: 3 },
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <Outlet />
        </Box>
        <BottomNav />
      </Box>
    </ProtectedRoute>
  );
};

export default MainLayout;
