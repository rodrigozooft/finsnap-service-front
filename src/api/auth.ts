import api from './client';
import type { User, TokenResponse, LoginRequest, RegisterRequest } from '@/types';

export async function login(data: LoginRequest): Promise<TokenResponse> {
  const response = await api.post<TokenResponse>('/auth/login', data);
  return response.data;
}

export async function register(data: RegisterRequest): Promise<TokenResponse> {
  const response = await api.post<TokenResponse>('/auth/register', data);
  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get<User>('/auth/me');
  return response.data;
}

export async function refreshToken(token: string): Promise<TokenResponse> {
  const response = await api.post<TokenResponse>('/auth/refresh', {
    refresh_token: token,
  });
  return response.data;
}
