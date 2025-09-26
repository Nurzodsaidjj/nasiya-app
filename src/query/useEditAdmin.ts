import { useMutation } from "@tanstack/react-query";
import { request } from "../request/request";
import type { adminDAta, ErrorResponse } from "../types";
import type { AxiosResponse } from "axios";

type EditAdminVariables = Partial<adminDAta> & { id: string };

export const useEditAdmin = () => {
  return useMutation<adminDAta, ErrorResponse, EditAdminVariables>({
    mutationFn: ({ id, ...data }) =>
      request.patch(`/admin/update/${id}`, data).then((res: AxiosResponse) => {
        return res.data.data;
      }),
  });
};
