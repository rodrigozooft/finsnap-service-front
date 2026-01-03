import api from './client';
import type {
  APIKey,
  APIKeyCreateRequest,
  APIKeyCreateResponse,
  APIKeyListResponse,
  MessageResponse,
} from '@/types';

export async function getAPIKeys(): Promise<APIKeyListResponse> {
  const response = await api.get<APIKeyListResponse>('/api-keys');
  return response.data;
}

export async function createAPIKey(data: APIKeyCreateRequest): Promise<APIKeyCreateResponse> {
  const response = await api.post<APIKeyCreateResponse>('/api-keys', data);
  return response.data;
}

export async function deleteAPIKey(id: string): Promise<MessageResponse> {
  const response = await api.delete<MessageResponse>(`/api-keys/${id}`);
  return response.data;
}

export async function deactivateAPIKey(id: string): Promise<APIKey> {
  const response = await api.post<APIKey>(`/api-keys/${id}/deactivate`);
  return response.data;
}

export async function activateAPIKey(id: string): Promise<APIKey> {
  const response = await api.post<APIKey>(`/api-keys/${id}/activate`);
  return response.data;
}
