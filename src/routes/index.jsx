import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import PageNotFound from "../components/common/PageNotFound";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import RequestsList from "../pages/requests/RequestsList";
import CreateServiceRequest from "../pages/create-request/CreateServiceRequest";
import CreateRequestErrorFallback from "../pages/create-request/CreateRequestErrorFallback";
import { MODULES } from "../constants/modules";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={`/${MODULES.DASHBOARD}`} replace />,
      },
      {
        path: MODULES.DASHBOARD,
        element: <Dashboard />,
      },
      {
        path: MODULES.REQUESTS,
        element: <RequestsList />,
      },
      {
        path: MODULES.CREATE_REQUEST,
        element: <CreateServiceRequest />,
        errorElement: <CreateRequestErrorFallback />,
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);
