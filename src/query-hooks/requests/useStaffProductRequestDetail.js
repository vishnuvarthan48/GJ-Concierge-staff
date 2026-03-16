import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { api } from "../../api/staff/requests";

export const useStaffProductRequestDetail = (id, options = {}, keys = []) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT_REQUEST_DETAIL, id, ...keys],
    queryFn: async () => {
      const res = await api.getProductRequestById(id);
      const data = res?.data !== undefined ? res.data : res;
      return data ? { ...data, groupItems: data?.groupItems ?? (data ? [data] : []) } : null;
    },
    enabled: Boolean(id),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};
