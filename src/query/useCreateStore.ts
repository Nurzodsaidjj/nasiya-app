import { useMutation } from '@tanstack/react-query';
import { request } from '../request/request';
import type { Store } from '../types';
import type { AxiosResponse } from 'axios';

type CreateStoreVariables = Omit<Store, 'id' | 'createdAt'>;

export const useCreateStore = () => {
  return useMutation<Store, Error, CreateStoreVariables>({
    mutationFn: (newStore) =>
      request.post('/store', newStore).then((res: AxiosResponse) => {
        return res.data.data;
      }),
  });
};
