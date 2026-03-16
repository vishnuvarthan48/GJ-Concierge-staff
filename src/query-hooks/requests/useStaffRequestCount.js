import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { api } from "../../api/staff/requests";
import { getStorageItem } from "../../utils/localStorageHandler";
import { STORAGE_KEYS } from "../../constants/storageKeys";

export const useStaffServiceRequestCount = () => {
  const staffId = getStorageItem(STORAGE_KEYS.STAFF_ID);
  return useQuery({
    queryKey: [QUERY_KEYS.SERVICE_REQUEST_COUNT, staffId],
    queryFn: () => api.getServiceRequestCount(),
    enabled: !!staffId,
  });
};

export const useStaffProductRequestCount = () => {
  const staffId = getStorageItem(STORAGE_KEYS.STAFF_ID);
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT_REQUEST_COUNT, staffId],
    queryFn: () => api.getProductRequestCount(),
    enabled: !!staffId,
  });
};
