import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { api } from "../../api/staff/requests";

export const useStaffServiceRequestList = (options = {}, keys = []) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SERVICE_REQUESTS, ...keys],
    queryFn: async () => {
      const res = await api.getServiceRequests();
      return Array.isArray(res) ? res : res?.list ?? [];
    },
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};
