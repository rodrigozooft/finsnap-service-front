import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useConnections } from '@/hooks/useConnections';
import { CreditCard, Link2, Calculator, ExternalLink } from 'lucide-react';

const PRICE_PER_CONNECTION_CLP = 4990;

export function BillingPage() {
  const { data: connectionsData, isLoading } = useConnections();

  const connections = connectionsData?.connections ?? [];
  const billableConnections = connections.filter((c) => c.is_billable);
  const monthlyCost = billableConnections.length * PRICE_PER_CONNECTION_CLP;

  const formatCLP = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Facturación</h1>
        <p className="text-muted-foreground">
          Administra tu suscripción y pagos
        </p>
      </div>

      {/* Subscription Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Estado de Suscripción</CardTitle>
              <CardDescription>Tu plan actual y uso</CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm">
              Pago por conexión
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Link2 className="h-4 w-4" />
                <span className="text-sm font-medium">Conexiones Activas</span>
              </div>
              <p className="mt-2 text-2xl font-bold">
                {isLoading ? '-' : billableConnections.length}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span className="text-sm font-medium">Precio por Conexión</span>
              </div>
              <p className="mt-2 text-2xl font-bold">
                {formatCLP(PRICE_PER_CONNECTION_CLP)}
                <span className="text-sm font-normal text-muted-foreground">/mes</span>
              </p>
            </div>

            <div className="rounded-lg border bg-primary/5 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calculator className="h-4 w-4" />
                <span className="text-sm font-medium">Total Mensual</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-primary">
                {isLoading ? '-' : formatCLP(monthlyCost)}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Próxima fecha de facturación</p>
              <p className="text-sm text-muted-foreground">
                Facturación mensual el día 1
              </p>
            </div>
            <Button>
              <CreditCard className="mr-2 h-4 w-4" />
              Pagar con Flow.cl
              <ExternalLink className="ml-2 h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Connections Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Conexiones Facturables</CardTitle>
          <CardDescription>
            Conexiones incluidas en tu facturación mensual
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Cargando...</p>
          ) : billableConnections.length === 0 ? (
            <div className="py-8 text-center">
              <Link2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="font-medium">No hay conexiones facturables</p>
              <p className="text-sm text-muted-foreground">
                Agrega conexiones para comenzar a sincronizar tus datos financieros
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {billableConnections.map((connection) => (
                <div
                  key={connection.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{connection.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {connection.connection_type.toUpperCase()}
                    </p>
                  </div>
                  <span className="font-medium">
                    {formatCLP(PRICE_PER_CONNECTION_CLP)}
                  </span>
                </div>
              ))}
              <Separator className="my-4" />
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total Mensual</span>
                <span className="text-primary">{formatCLP(monthlyCost)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Pago</CardTitle>
          <CardDescription>
            Pagos seguros con Flow.cl
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-start gap-4">
              <CreditCard className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Procesamiento de Pago Seguro</p>
                <p className="text-sm text-muted-foreground">
                  Todos los pagos son procesados de forma segura a través de Flow.cl,
                  la plataforma de pagos líder en Chile. Aceptamos tarjetas de crédito,
                  tarjetas de débito y transferencias bancarias.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
