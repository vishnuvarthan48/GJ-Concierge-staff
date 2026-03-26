import { useAuth } from "./useAuth";

/**
 * Department head UX: API sets staff.departmentAdmin when department_admin or department_user
 * exists for this user. Fallback: OAuth userType ADMIN with a staff department (legacy logins).
 */
export function useIsDepartmentAdminStaff() {
  const { staff, user } = useAuth();
  if (staff?.departmentAdmin === true) return true;
  const ut = user?.userType;
  if ((ut === "ADMIN" || ut === "Admin") && staff?.department?.id) return true;
  return false;
}
