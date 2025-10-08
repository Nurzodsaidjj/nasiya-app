import { useQuery } from '@tanstack/react-query';
import { request } from '../request/request';
import type { Store } from '../types';

interface GetStoresResponse {
  data: Store[];
}

interface GetStoreResponse {
  data: Store;
}

export const useGetStore = (options?: { enabled?: boolean }) => {
  return useQuery<Store[]>({
    queryKey: ['stores'],
    queryFn: () =>
      request.get<GetStoresResponse>('/store').then((res) =>
        res.data.data.map((item: Store) => ({
          id: item.id,
          fullName: item.fullName || item.name,
          phoneNumber: item.phoneNumber || item.phone,
          email: item.email,
          role: item.role,
          wallet: item.wallet,
          createdAt: item.createdAt,
        }))
      ),
    refetchOnMount: 'always',
    refetchOnWindowFocus: 'always',
    ...options,
  });
};

export const useGetStoreById = (id: string, options?: { enabled?: boolean }) => {
  return useQuery<Store>({
    queryKey: ['store', id],
    queryFn: () =>
      request.get<GetStoreResponse>(`/store/${id}`).then((res) => ({
        id: res.data.data.id,
        fullName: res.data.data.fullName || res.data.data.name,
        phoneNumber: res.data.data.phoneNumber || res.data.data.phone,
        email: res.data.data.email,
        role: res.data.data.role,
        wallet: res.data.data.wallet,
        createdAt: res.data.data.createdAt,
      })),
    enabled: !!id,
    ...options,
  });
};
