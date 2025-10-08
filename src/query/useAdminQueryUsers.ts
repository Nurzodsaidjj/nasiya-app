import { useQuery } from '@tanstack/react-query';
import { request } from '../request/request';
import type { adminDAta } from '../types';

interface GetAdminsResponse {
  data: adminDAta[];
}

export const useAdminQueryUsers = () => {
  return useQuery<adminDAta[]>({
    queryKey: ['admins'],
    queryFn: () =>
      request.get<GetAdminsResponse>('/admin').then((res) => res.data.data),
  });
};
