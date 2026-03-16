import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { api } from "../../api/staff/requests";

export const useStaffProductRequestStatuses = (keys = []) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT_REQUEST_STATUSES, ...keys],
    queryFn: async () => {
      const res = await api.getProductRequestStatuses();
      return Array.isArray(res) ? res : res?.list ?? [];
    },
  });
};
