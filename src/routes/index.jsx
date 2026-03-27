import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import PageNotFound from "../components/common/PageNotFound";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import RequestsList from "../pages/requests/RequestsList";
import DepartmentStaffs from "../pages/staff/DepartmentStaffs";
import CreateServiceRequest from "../pages/create-request/CreateServiceRequest";
import CreateRequestErrorFallback from "../pages/create-request/CreateRequestErrorFallback";
import { MODULES } from "../constants/modules";
import { getStorageItem } from "../utils/localStorageHandler";
import { STORAGE_KEYS } from "../constants/storageKeys";

const RootEntry = () => {
  const token = getStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
  return token ? <Navigate to={`/${MODULES.DASHBOARD}`} replace /> : <Login />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootEntry />,
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
        path: MODULES.STAFF,
        element: <DepartmentStaffs />,
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
