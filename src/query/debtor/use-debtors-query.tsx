import { useQuery } from '@tanstack/react-query';
import { request } from '../../request/request';
import type { Debtor } from '../../types/index';
import { loadState } from '../../storage/store';

interface GetDebtorsResponse {
  data: Debtor[];
}

export const useGetDebtors = (storeId?: string, options?: { enabled?: boolean }) => {
  return useQuery<Debtor[]>({
    queryKey: ['debtors', storeId],
    queryFn: () => {
      const params: { storeId?: string } = {};
      if (storeId) {
        params.storeId = storeId;
      }
      return request.get('/debtor', { params }).then((res) =>
        res.data.data.map((item: any): Debtor => ({
          id: item.id,
          fullName: item.fullName,
          address: item.address,
          description: item.description,
          store: {
            id: item.store.id,
            fullName: item.store.fullName,
            phoneNumber: item.store.phoneNumber,
            email: item.store.email,
            role: item.store.role,
            wallet: item.store.wallet,
            createdAt: item.store.createdAt,
          },
          imagesDebtor: item.imagesDebtor,
          createdAt: item.createdAt,
        }))
      );
    },
    enabled: options?.enabled,
  });
};

export const useGetDebtorById = (id?: string, options?: { enabled?: boolean }) => {
  return useQuery<Debtor>({
    queryKey: ['debtors', id],
    queryFn: () => request.get(`/debtor/${id}`).then((res) => res.data.data),
    enabled: !!id && options?.enabled,
  });
};
