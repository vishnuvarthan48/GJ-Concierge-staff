import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { api } from "../../api/staff/requests";

export const useStaffServiceRequestDetail = (id, options = {}, keys = []) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SERVICE_REQUEST_DETAIL, id, ...keys],
    queryFn: async () => {
      const res = await api.getServiceRequestById(id);
      return res?.data !== undefined ? res.data : res;
    },
    enabled: Boolean(id),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};
