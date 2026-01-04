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
import { useConnections, useDeleteConnection, useTriggerSync } from '@/hooks/useConnections';
import { CreateConnectionDialog } from '@/components/connections/CreateConnectionDialog';
import { toast } from 'sonner';
import { Plus, RefreshCw, Trash2, Link2, Loader2 } from 'lucide-react';
import type { Connection, ConnectionStatus } from '@/types';

const statusVariants: Record<ConnectionStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  active: 'default',
  pending: 'secondary',
  syncing: 'secondary',
  error: 'destructive',
  disconnected: 'outline',
};

const connectionTypeLabels: Record<string, string> = {
  sii: 'SII (Servicio de Impuestos)',
  bank_itau: 'Banco Itaú',
  bank_chile: 'Banco de Chile',
  bank_santander: 'Banco Santander',
};

export function ConnectionsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const { data, isLoading, error } = useConnections();
  const deleteConnection = useDeleteConnection();
  const triggerSync = useTriggerSync();

  const connections = data?.connections ?? [];

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteConnection.mutateAsync(deleteId);
      toast.success('Conexión eliminada');
      setDeleteId(null);
    } catch {
      toast.error('Error al eliminar la conexión');
    }
  };

  const handleSync = async (id: string) => {
    setSyncingId(id);
    try {
      await triggerSync.mutateAsync(id);
      toast.success('Sincronización iniciada');
    } catch {
      toast.error('Error al iniciar la sincronización');
    } finally {
      setSyncingId(null);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('es-CL');
  };

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Conexiones</h1>
        <Card className="border-destructive">
          <CardContent className="py-6 text-center">
            <p className="text-destructive">Error al cargar las conexiones</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Conexiones</h1>
          <p className="text-muted-foreground">
            Administra tus conexiones con el SII y bancos
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Conexión
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : connections.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Link2 className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-medium">Aún no hay conexiones</h3>
            <p className="mb-4 text-center text-muted-foreground">
              Conecta tu SII o cuentas bancarias para comenzar a sincronizar datos
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar tu primera conexión
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Última Sincronización</TableHead>
                <TableHead>Próxima Sincronización</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {connections.map((connection: Connection) => (
                <TableRow key={connection.id}>
                  <TableCell className="font-medium">{connection.name}</TableCell>
                  <TableCell>
                    {connectionTypeLabels[connection.connection_type] || connection.connection_type}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[connection.status]}>
                      {connection.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(connection.last_sync_at)}</TableCell>
                  <TableCell>{formatDate(connection.next_sync_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(connection.id)}
                        disabled={syncingId === connection.id || connection.status === 'syncing'}
                      >
                        {syncingId === connection.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteId(connection.id)}
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

      <CreateConnectionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Conexión</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar esta conexión? Esta acción no se puede
              deshacer y detendrá toda la sincronización de esta conexión.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteConnection.isPending ? (
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
