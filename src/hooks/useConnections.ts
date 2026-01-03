import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as connectionsApi from '@/api/connections';
import type { ConnectionCreateRequest, ConnectionUpdateRequest } from '@/types';

export function useConnections() {
  return useQuery({
    queryKey: ['connections'],
    queryFn: connectionsApi.getConnections,
  });
}

export function useConnection(id: string) {
  return useQuery({
    queryKey: ['connections', id],
    queryFn: () => connectionsApi.getConnection(id),
    enabled: !!id,
  });
}

export function useCreateConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConnectionCreateRequest) => connectionsApi.createConnection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
  });
}

export function useUpdateConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ConnectionUpdateRequest }) =>
      connectionsApi.updateConnection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
  });
}

export function useDeleteConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => connectionsApi.deleteConnection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
  });
}

export function useTriggerSync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => connectionsApi.triggerSync(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
  });
}
