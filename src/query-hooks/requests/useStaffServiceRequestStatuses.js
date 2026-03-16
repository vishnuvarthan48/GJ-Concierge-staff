import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { api } from "../../api/staff/requests";

export const useStaffServiceRequestStatuses = (keys = []) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SERVICE_REQUEST_STATUSES, ...keys],
    queryFn: async () => {
      const res = await api.getServiceRequestStatuses();
      return Array.isArray(res) ? res : res?.list ?? [];
    },
  });
};
