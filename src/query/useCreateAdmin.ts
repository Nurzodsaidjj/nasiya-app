import { useMutation } from "@tanstack/react-query";
import { request } from "../request/request";
import type { adminDAta } from "../types";
import type { AxiosResponse } from "axios";

export const useCreateAdmin = () => {
  return useMutation({
    mutationFn: (newAdmin: Omit<adminDAta, "id">) =>
      request.post("/admin", newAdmin).then((res: AxiosResponse) => {
        return res.data.data;
      }),
  });
};
