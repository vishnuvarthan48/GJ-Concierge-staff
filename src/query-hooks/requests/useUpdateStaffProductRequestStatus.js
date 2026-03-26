import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { api } from "../../api/staff/requests";
import { toast } from "react-toastify";

export const useUpdateStaffProductRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await api.updateProductRequestStatus(payload);
      if (res?.status?.code !== 1000 && res?.status?.code != null) {
        throw new Error(res?.status?.message || "Failed to update status");
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.PRODUCT_REQUESTS]);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCT_REQUEST_DETAIL] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update status.");
    },
  });
};
