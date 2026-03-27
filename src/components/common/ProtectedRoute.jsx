import { Navigate } from "react-router-dom";
import { getStorageItem } from "../../utils/localStorageHandler";
import { STORAGE_KEYS } from "../../constants/storageKeys";

const ProtectedRoute = ({ children }) => {
  const token = getStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
  const staffId = getStorageItem(STORAGE_KEYS.STAFF_ID);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!staffId) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        Unable to load staff profile. Please try logging in again.
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
