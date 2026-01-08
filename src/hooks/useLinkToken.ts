import { useMutation } from '@tanstack/react-query';
import * as linkTokenApi from '@/api/linkToken';
import type { LinkTokenCreateRequest } from '@/types';

export function useCreateLinkToken() {
  return useMutation({
    mutationFn: (data: LinkTokenCreateRequest) => linkTokenApi.createLinkToken(data),
  });
}
