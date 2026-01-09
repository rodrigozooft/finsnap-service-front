import api from './client';
import type { LinkTokenCreateRequest, LinkTokenResponse } from '@/types';

export async function createLinkToken(data: LinkTokenCreateRequest): Promise<LinkTokenResponse> {
  const response = await api.post<LinkTokenResponse>('/link/token/create', data);
  return response.data;
}
