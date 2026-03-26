import axiosServices from "../index";
import { getStorageItem } from "../../utils/localStorageHandler";
import { STORAGE_KEYS } from "../../constants/storageKeys";

const API_VERSION = import.meta.env.VITE_API_VERSION || "v1";

const unwrap = (res) => (res?.data !== undefined ? res.data : res);

/** Get staff by user id - used after login to obtain staffId */
export const getStaffByUserId = async (userId) => {
  const response = await axiosServices.get(`/${API_VERSION}/staff/user/${userId}`);
  return unwrap(response.data);
};

/** Create staff record if not exists - for users with STAFF role but no Staff record */
export const ensureStaffForUser = async (userId, tenantId, locationId) => {
  const response = await axiosServices.post(`/${API_VERSION}/staff/ensure-for-user`, {
    userId,
    tenantId,
    locationId,
  });
  return unwrap(response.data);
};

/** Department staffs (for department admin staff tab). */
export const getDepartmentStaffs = async ({ tenantId, locationId, departmentId }) => {
  if (!tenantId || !locationId || !departmentId) return [];
  const response = await axiosServices.get(
    `/${API_VERSION}/admin/tenant/${tenantId}/location/${locationId}/staff/department/${departmentId}`
  );
  const data = unwrap(response.data);
  return Array.isArray(data) ? data : data?.list ?? [];
};

/** Build staff base URL: /v1/staff/{staffId} - uses staffId from localStorage */
export const getStaffBaseUrl = () => {
  const staffId = getStorageItem(STORAGE_KEYS.STAFF_ID);
  return `${API_VERSION}/staff/${staffId}`;
};
