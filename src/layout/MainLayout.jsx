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
          minHeight: "100vh",
          pb: 0,
        }}
      >
        <Header />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 2,
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
