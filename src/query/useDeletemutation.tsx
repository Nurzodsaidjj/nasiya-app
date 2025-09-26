import { useMutation } from "@tanstack/react-query";
import { request } from "../request/request";
import type { adminDAta, ErrorResponse } from "../types/index";

export const useDeletemutation = () => {
  return useMutation<void, ErrorResponse, string>({
    mutationFn: (id: string) =>
      request.delete(`/admin/${id}`).then((res) => {
        return res.data.data;
      }),
  });
};
