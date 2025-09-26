import { useQuery } from "@tanstack/react-query";
import {  request } from "../request/request";
import type { adminDAta } from "../types";

export const useAdminQueryUsers = () => {
  return useQuery<adminDAta[]>({
    queryKey: ["admins"],
    queryFn: () => request.get("/admin").then((res) => res.data.data),
  });
};