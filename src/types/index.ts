// User types
export interface User {
  id: string;
  email: string;
  company_name: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  company_name?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface RefreshRequest {
  refresh_token: string;
}

// Connection types
export type ConnectionType = 'sii' | 'bank_itau' | 'bank_chile' | 'bank_santander';
export type ConnectionStatus = 'pending' | 'active' | 'error' | 'disconnected' | 'syncing';

export interface Connection {
  id: string;
  connection_type: ConnectionType;
  name: string;
  status: ConnectionStatus;
  webhook_url: string | null;
  webhook_secret: string | null;
  last_sync_at: string | null;
  last_error: string | null;
  is_billable: boolean;
  created_at: string;
  updated_at: string;
  sync_enabled: boolean;
  sync_interval_hours: number;
  next_sync_at: string | null;
}

export interface SIICredentials {
  rut: string;
  password: string;
}

export interface ItauCredentials {
  rut_usuario: string;
  clave: string;
  rut_empresa?: string;
}

export interface ConnectionCreateRequest {
  connection_type: ConnectionType;
  name: string;
  webhook_url?: string;
  sii_credentials?: SIICredentials;
  itau_credentials?: ItauCredentials;
}

export interface ConnectionUpdateRequest {
  name?: string;
  webhook_url?: string;
  is_enabled?: boolean;
}

export interface ConnectionListResponse {
  connections: Connection[];
  total: number;
}

// API Key types
export interface APIKey {
  id: string;
  name: string;
  key_prefix: string;
  is_active: boolean;
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface APIKeyCreateRequest {
  name: string;
  expires_in_days?: number;
}

export interface APIKeyCreateResponse {
  id: string;
  name: string;
  key: string;
  key_prefix: string;
  expires_at: string | null;
  created_at: string;
}

export interface APIKeyListResponse {
  api_keys: APIKey[];
  total: number;
}

// Generic API response
export interface MessageResponse {
  message: string;
}

// Link Token types
export interface LinkTokenCreateRequest {
  connection_type: ConnectionType;
  name: string;
  webhook_url?: string;
}

export interface LinkTokenResponse {
  link_token: string;
  expiration: string;
}

// Connect SDK types are exported from @finsnap/connect-js package
