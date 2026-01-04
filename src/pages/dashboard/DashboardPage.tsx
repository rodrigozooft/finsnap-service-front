import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useConnections } from '@/hooks/useConnections';
import { Link2, RefreshCw, Clock, AlertCircle, Plus } from 'lucide-react';
import type { ConnectionStatus } from '@/types';

const statusColors: Record<ConnectionStatus, string> = {
  active: 'bg-green-500',
  pending: 'bg-yellow-500',
  syncing: 'bg-blue-500',
  error: 'bg-red-500',
  disconnected: 'bg-gray-500',
};

export function DashboardPage() {
  const { data, isLoading, error } = useConnections();

  const connections = data?.connections ?? [];
  const totalConnections = connections.length;
  const activeConnections = connections.filter((c) => c.status === 'active').length;
  const syncingConnections = connections.filter((c) => c.status === 'syncing').length;
  const errorConnections = connections.filter((c) => c.status === 'error').length;

  const lastSync = connections
    .map((c) => c.last_sync_at)
    .filter(Boolean)
    .sort()
    .reverse()[0];

  const formatDate = (date: string | null) => {
    if (!date) return 'Nunca';
    return new Date(date).toLocaleString('es-CL');
  };

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Panel de Control</h1>
        <Card className="border-destructive">
          <CardContent className="flex items-center gap-4 pt-6">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div>
              <p className="font-medium">Error al cargar los datos del panel</p>
              <p className="text-sm text-muted-foreground">
                Por favor intenta refrescar la página
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Panel de Control</h1>
          <p className="text-muted-foreground">
            Resumen de tus conexiones y actividad de sincronización
          </p>
        </div>
        <Button asChild>
          <Link to="/connections">
            <Plus className="mr-2 h-4 w-4" />
            Agregar Conexión
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Conexiones</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{totalConnections}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activas</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{activeConnections}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sincronizando</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{syncingConnections}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Última Sincronización</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-sm font-medium">{formatDate(lastSync ?? null)}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Connection Status Summary */}
      {!isLoading && connections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Estado de Conexiones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {connections.slice(0, 5).map((connection) => (
                <div
                  key={connection.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-3 w-3 rounded-full ${statusColors[connection.status]}`} />
                    <div>
                      <p className="font-medium">{connection.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {connection.connection_type.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={connection.status === 'error' ? 'destructive' : 'secondary'}>
                      {connection.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(connection.last_sync_at)}
                    </span>
                  </div>
                </div>
              ))}
              {connections.length > 5 && (
                <Button variant="outline" asChild className="w-full">
                  <Link to="/connections">Ver todas las conexiones</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && connections.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Link2 className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-medium">Aún no hay conexiones</h3>
            <p className="mb-4 text-center text-muted-foreground">
              Conecta tu SII o cuentas bancarias para comenzar a sincronizar datos
            </p>
            <Button asChild>
              <Link to="/connections">
                <Plus className="mr-2 h-4 w-4" />
                Agregar tu primera conexión
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Errors Summary */}
      {!isLoading && errorConnections > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              {errorConnections} {errorConnections > 1 ? 'Conexiones con Errores' : 'Conexión con Error'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {connections
                .filter((c) => c.status === 'error')
                .map((connection) => (
                  <div key={connection.id} className="rounded-lg bg-destructive/10 p-3">
                    <p className="font-medium">{connection.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {connection.last_error || 'Unknown error'}
                    </p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
