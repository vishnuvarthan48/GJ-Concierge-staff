import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { api } from "../../api/staff/requests";
import { toast } from "react-toastify";

export const useUpdateStaffServiceRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await api.updateServiceRequestStatus(payload);
      if (res?.status?.code !== 1000 && res?.status?.code != null) {
        throw new Error(res?.status?.message || "Failed to update status");
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.SERVICE_REQUESTS]);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SERVICE_REQUEST_DETAIL] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update status.");
    },
  });
};
