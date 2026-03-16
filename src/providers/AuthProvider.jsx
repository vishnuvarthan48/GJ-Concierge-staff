import { useEffect, useState } from "react";
import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from "../utils/localStorageHandler";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { AuthContext } from "../contexts/AuthContext";

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() =>
    getStorageItem(STORAGE_KEYS.ACCESS_TOKEN),
  );
  const [refreshToken, setRefreshToken] = useState(() =>
    getStorageItem(STORAGE_KEYS.REFRESH_TOKEN),
  );
  const [user, setUser] = useState(() => getStorageItem(STORAGE_KEYS.USER));
  const [tenantId, setTenantId] = useState(() =>
    getStorageItem(STORAGE_KEYS.TENANT_ID),
  );
  const [locationId, setLocationId] = useState(() =>
    getStorageItem(STORAGE_KEYS.LOCATION_ID),
  );
  const [staffId, setStaffId] = useState(() =>
    getStorageItem(STORAGE_KEYS.STAFF_ID),
  );
  const [staff, setStaff] = useState(() => getStorageItem(STORAGE_KEYS.STAFF));

  useEffect(() => {
    accessToken
      ? setStorageItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
      : removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN);

    refreshToken
      ? setStorageItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
      : removeStorageItem(STORAGE_KEYS.REFRESH_TOKEN);

    user
      ? setStorageItem(STORAGE_KEYS.USER, user)
      : removeStorageItem(STORAGE_KEYS.USER);

    tenantId
      ? setStorageItem(STORAGE_KEYS.TENANT_ID, tenantId)
      : removeStorageItem(STORAGE_KEYS.TENANT_ID);

    locationId
      ? setStorageItem(STORAGE_KEYS.LOCATION_ID, locationId)
      : removeStorageItem(STORAGE_KEYS.LOCATION_ID);

    staffId
      ? setStorageItem(STORAGE_KEYS.STAFF_ID, staffId)
      : removeStorageItem(STORAGE_KEYS.STAFF_ID);
    staff
      ? setStorageItem(STORAGE_KEYS.STAFF, staff)
      : removeStorageItem(STORAGE_KEYS.STAFF);
  }, [accessToken, refreshToken, user, tenantId, locationId, staffId, staff]);

  const handleLogin = (response, staff) => {
    const userId = response.id ?? response.user_id;
    const tenantIdVal = response.tenantId ?? response.tenant_id;
    const locationIdVal = response.locationId ?? response.location_id;
    const userObj = {
      id: userId,
      firstName: response.firstName,
      lastName: response.lastName,
      email: response.email,
      userType: response.userType,
      active: response.active,
      customerId: response.customerId ?? null,
    };
    const staffIdVal = staff?.id != null ? String(staff.id) : null;

    setAccessToken(response.access_token);
    setRefreshToken(response.refresh_token ?? null);
    setTenantId(tenantIdVal ?? null);
    setLocationId(locationIdVal ?? null);
    setUser(userObj);
    setStaffId(staffIdVal);
    setStaff(staff ?? null);

    setStorageItem(STORAGE_KEYS.ACCESS_TOKEN, response.access_token);
    setStorageItem(STORAGE_KEYS.REFRESH_TOKEN, response.refresh_token ?? null);
    setStorageItem(STORAGE_KEYS.TENANT_ID, tenantIdVal ?? null);
    setStorageItem(STORAGE_KEYS.LOCATION_ID, locationIdVal ?? null);
    setStorageItem(STORAGE_KEYS.USER, userObj);
    if (staffIdVal) setStorageItem(STORAGE_KEYS.STAFF_ID, staffIdVal);
    if (staff) setStorageItem(STORAGE_KEYS.STAFF, staff);
  };

  const handleLogout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setTenantId(null);
    setLocationId(null);
    setStaffId(null);
    setStaff(null);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        user,
        tenantId,
        locationId,
        staffId,
        staff,
        isAuthenticated: !!accessToken,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
