import api from './client';
import type {
  Connection,
  ConnectionCreateRequest,
  ConnectionUpdateRequest,
  ConnectionListResponse,
  MessageResponse,
} from '@/types';

export async function getConnections(): Promise<ConnectionListResponse> {
  const response = await api.get<ConnectionListResponse>('/connections');
  return response.data;
}

export async function getConnection(id: string): Promise<Connection> {
  const response = await api.get<Connection>(`/connections/${id}`);
  return response.data;
}

export async function createConnection(data: ConnectionCreateRequest): Promise<Connection> {
  const response = await api.post<Connection>('/connections', data);
  return response.data;
}

export async function updateConnection(id: string, data: ConnectionUpdateRequest): Promise<Connection> {
  const response = await api.put<Connection>(`/connections/${id}`, data);
  return response.data;
}

export async function deleteConnection(id: string): Promise<MessageResponse> {
  const response = await api.delete<MessageResponse>(`/connections/${id}`);
  return response.data;
}

export async function triggerSync(id: string): Promise<MessageResponse> {
  const response = await api.post<MessageResponse>(`/connections/${id}/sync`);
  return response.data;
}
