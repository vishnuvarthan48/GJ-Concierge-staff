import { getStorageItem } from "./localStorageHandler";
import { STORAGE_KEYS } from "../constants/storageKeys";

/**
 * Resolves tenant UUID for API calls. OAuth may omit tenantId for some roles;
 * staff profile includes tenantId and location.tenantId.
 */
export function resolveTenantId(staff) {
  const raw = getStorageItem(STORAGE_KEYS.TENANT_ID);
  if (raw != null && raw !== "" && String(raw).toLowerCase() !== "null") {
    return String(raw);
  }
  const fromStaff =
    staff?.tenantId ??
    staff?.location?.tenantId ??
    staff?.tenant?.id ??
    staff?.location?.tenant?.id;
  if (fromStaff != null && fromStaff !== "" && String(fromStaff).toLowerCase() !== "null") {
    return String(fromStaff);
  }
  return null;
}
