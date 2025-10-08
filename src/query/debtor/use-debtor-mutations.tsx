import { useMutation } from '@tanstack/react-query';
import { request } from '../../request/request';
import type { Debtor, DebtorCreatePayload } from '../../types/index';
import type { AxiosResponse } from 'axios';

type UpdateDebtorVariables = Partial<Omit<Debtor, 'id' | 'createdAt'>> & { id: string }; 

export const useCreateDebtor = () => {
  return useMutation<Debtor, Error, FormData>({
    mutationFn: (formData) =>
      request.post('/debtor', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then((res: AxiosResponse) => {
        return res.data.data;
      }),
  });
};

export const useUpdateDebtor = () => {
  return useMutation<Debtor, Error, { id: string; formData: FormData }>({
    mutationFn: ({ id, formData }) =>
      request.patch(`/debtor/${id}`, formData).then((res: AxiosResponse) => {
        return res.data.data;
      }),
  });
};

export const useDeleteDebtor = () => {
  return useMutation<void, Error, string>({
    mutationFn: (id) =>
      request.delete(`/debtor/${id}`).then((res: AxiosResponse) => {
        return res.data.data;
      }),
  });
};
