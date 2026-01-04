import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  useAPIKeys,
  useDeleteAPIKey,
  useActivateAPIKey,
  useDeactivateAPIKey,
} from '@/hooks/useAPIKeys';
import { CreateAPIKeyDialog } from '@/components/api-keys/CreateAPIKeyDialog';
import { KeyRevealDialog } from '@/components/api-keys/KeyRevealDialog';
import { toast } from 'sonner';
import { Plus, Trash2, Key, Loader2, Power, PowerOff } from 'lucide-react';
import type { APIKey } from '@/types';

export function APIKeysPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);

  const { data, isLoading, error } = useAPIKeys();
  const deleteAPIKey = useDeleteAPIKey();
  const activateAPIKey = useActivateAPIKey();
  const deactivateAPIKey = useDeactivateAPIKey();

  const apiKeys = data?.api_keys ?? [];

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteAPIKey.mutateAsync(deleteId);
      toast.success('Clave API eliminada');
      setDeleteId(null);
    } catch {
      toast.error('Error al eliminar la clave API');
    }
  };

  const handleToggleActive = async (key: APIKey) => {
    try {
      if (key.is_active) {
        await deactivateAPIKey.mutateAsync(key.id);
        toast.success('Clave API desactivada');
      } else {
        await activateAPIKey.mutateAsync(key.id);
        toast.success('Clave API activada');
      }
    } catch {
      toast.error('Error al actualizar la clave API');
    }
  };

  const handleKeyCreated = (key: string) => {
    setRevealedKey(key);
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-CL');
  };

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Claves API</h1>
        <Card className="border-destructive">
          <CardContent className="py-6 text-center">
            <p className="text-destructive">Error al cargar las claves API</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Claves API</h1>
          <p className="text-muted-foreground">
            Administra las claves API para acceso programático
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Crear Clave API
        </Button>
      </div>

      {/* Usage Instructions */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-start gap-4">
            <Key className="mt-1 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Cómo usar las Claves API</p>
              <p className="text-sm text-muted-foreground">
                Incluye tu clave API en las peticiones usando el header:{' '}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                  X-API-Key: fsk_tu_clave_aqui
                </code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="py-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : apiKeys.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Key className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-medium">Aún no hay claves API</h3>
            <p className="mb-4 text-center text-muted-foreground">
              Crea una clave API para acceder a la API de FinSnap programáticamente
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Crear tu primera clave API
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prefijo de Clave</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead>Último Uso</TableHead>
                <TableHead>Expira</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey: APIKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell>
                    <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                      {apiKey.key_prefix}...
                    </code>
                  </TableCell>
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell>
                    <Badge variant={apiKey.is_active ? 'default' : 'secondary'}>
                      {apiKey.is_active ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(apiKey.created_at)}</TableCell>
                  <TableCell>{formatDate(apiKey.last_used_at)}</TableCell>
                  <TableCell>{formatDate(apiKey.expires_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(apiKey)}
                        title={apiKey.is_active ? 'Desactivar' : 'Activar'}
                      >
                        {apiKey.is_active ? (
                          <PowerOff className="h-4 w-4" />
                        ) : (
                          <Power className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteId(apiKey.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <CreateAPIKeyDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onKeyCreated={handleKeyCreated}
      />

      <KeyRevealDialog
        apiKey={revealedKey}
        onClose={() => setRevealedKey(null)}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Clave API</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar esta clave API? Esta acción no se puede
              deshacer y las integraciones que usen esta clave dejarán de funcionar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteAPIKey.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
