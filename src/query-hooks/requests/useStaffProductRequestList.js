import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { api } from "../../api/staff/requests";

export const useStaffProductRequestList = (options = {}, keys = []) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT_REQUESTS, ...keys],
    queryFn: async () => {
      const res = await api.getProductRequests();
      return Array.isArray(res) ? res : res?.list ?? [];
    },
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};
