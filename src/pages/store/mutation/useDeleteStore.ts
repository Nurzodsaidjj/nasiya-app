import { useMutation } from '@tanstack/react-query';
import { request } from '../../../request/request';
import type { AxiosResponse } from 'axios';

export const useDeleteStore = () => {
  return useMutation<void, Error, string>({
    mutationFn: (id) =>
      request.delete(`/store/${id}`).then((res: AxiosResponse) => {
        return res.data;
      }),
  });
};
