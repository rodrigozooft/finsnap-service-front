import { useCallback } from 'react';
import { create, type ConnectionMetadata, type ConnectError, type ExitMetadata } from '@finsnap/connect-js';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseConnectOptions {
  onSuccess?: (connectionId: string, metadata: ConnectionMetadata) => void;
  onExit?: (error: ConnectError | null, metadata: ExitMetadata) => void;
  onLoad?: () => void;
}

export function useConnect(options: UseConnectOptions = {}) {
  const queryClient = useQueryClient();

  const openConnect = useCallback(
    (linkToken: string) => {
      const handler = create({
        token: linkToken,
        embedUrl: import.meta.env.VITE_CONNECT_EMBED_URL,
        onSuccess: (connectionId: string, metadata: ConnectionMetadata) => {
          toast.success('Cuenta conectada exitosamente');
          queryClient.invalidateQueries({ queryKey: ['connections'] });
          options.onSuccess?.(connectionId, metadata);
        },
        onExit: (error: ConnectError | null, metadata: ExitMetadata) => {
          if (error) {
            toast.error(error.errorMessage || 'Error al conectar la cuenta');
          }
          options.onExit?.(error, metadata);
        },
        onLoad: () => {
          options.onLoad?.();
        },
      });

      handler.open();
    },
    [queryClient, options]
  );

  return { openConnect };
}
