import { useMutation } from '@tanstack/react-query';
import { request } from '../../../request/request';
import type { Store } from '../../../types/index';
import type { AxiosResponse } from 'axios';

type UpdateStoreVariables = Partial<Omit<Store, 'id' | 'createdAt'>> & { id: string };

export const useUpdateStore = () => {
  return useMutation<Store, Error, UpdateStoreVariables>({
    mutationFn: ({ id, password, ...data }) => {
      const body = password ? { ...data, password } : data;
      return request.patch(`/store/${id}`, body).then((res: AxiosResponse) => res.data.data);
    },
  });
};