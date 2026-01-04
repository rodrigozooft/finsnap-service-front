import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateConnection } from '@/hooks/useConnections';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { ConnectionType } from '@/types';

interface CreateConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const connectionTypes: { value: ConnectionType; label: string }[] = [
  { value: 'sii', label: 'SII (Servicio de Impuestos)' },
  { value: 'bank_itau', label: 'Banco Itaú' },
];

export function CreateConnectionDialog({
  open,
  onOpenChange,
}: CreateConnectionDialogProps) {
  const [connectionType, setConnectionType] = useState<ConnectionType | ''>('');
  const [name, setName] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');

  // SII credentials
  const [siiRut, setSiiRut] = useState('');
  const [siiPassword, setSiiPassword] = useState('');

  // Itau credentials
  const [itauRutUsuario, setItauRutUsuario] = useState('');
  const [itauClave, setItauClave] = useState('');
  const [itauRutEmpresa, setItauRutEmpresa] = useState('');

  const createConnection = useCreateConnection();

  const resetForm = () => {
    setConnectionType('');
    setName('');
    setWebhookUrl('');
    setSiiRut('');
    setSiiPassword('');
    setItauRutUsuario('');
    setItauClave('');
    setItauRutEmpresa('');
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connectionType || !name) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      await createConnection.mutateAsync({
        connection_type: connectionType,
        name,
        webhook_url: webhookUrl || undefined,
        sii_credentials:
          connectionType === 'sii'
            ? { rut: siiRut, password: siiPassword }
            : undefined,
        itau_credentials:
          connectionType === 'bank_itau'
            ? {
                rut_usuario: itauRutUsuario,
                clave: itauClave,
                rut_empresa: itauRutEmpresa || undefined,
              }
            : undefined,
      });
      toast.success('Conexión creada correctamente');
      handleClose();
    } catch {
      toast.error('Error al crear la conexión');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Agregar Conexión</DialogTitle>
            <DialogDescription>
              Conecta una nueva fuente de datos para sincronizar tu información financiera
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Conexión *</Label>
              <Select
                value={connectionType}
                onValueChange={(value) => setConnectionType(value as ConnectionType)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {connectionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Conexión *</Label>
              <Input
                id="name"
                placeholder="ej., Mi Empresa SII"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook">URL del Webhook (opcional)</Label>
              <Input
                id="webhook"
                type="url"
                placeholder="https://tu-servidor.com/webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Recibe notificaciones cuando la sincronización se complete
              </p>
            </div>

            {/* SII Credentials */}
            {connectionType === 'sii' && (
              <div className="space-y-4 rounded-lg border p-4">
                <h4 className="font-medium">Credenciales SII</h4>
                <div className="space-y-2">
                  <Label htmlFor="sii-rut">RUT *</Label>
                  <Input
                    id="sii-rut"
                    placeholder="12345678-9"
                    value={siiRut}
                    onChange={(e) => setSiiRut(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sii-password">Contraseña *</Label>
                  <Input
                    id="sii-password"
                    type="password"
                    placeholder="Contraseña del SII"
                    value={siiPassword}
                    onChange={(e) => setSiiPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Itau Credentials */}
            {connectionType === 'bank_itau' && (
              <div className="space-y-4 rounded-lg border p-4">
                <h4 className="font-medium">Credenciales Banco Itaú</h4>
                <div className="space-y-2">
                  <Label htmlFor="itau-rut">RUT Usuario *</Label>
                  <Input
                    id="itau-rut"
                    placeholder="12345678-9"
                    value={itauRutUsuario}
                    onChange={(e) => setItauRutUsuario(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="itau-clave">Clave *</Label>
                  <Input
                    id="itau-clave"
                    type="password"
                    placeholder="Contraseña del banco"
                    value={itauClave}
                    onChange={(e) => setItauClave(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="itau-empresa">RUT Empresa (opcional)</Label>
                  <Input
                    id="itau-empresa"
                    placeholder="RUT de la empresa si es diferente"
                    value={itauRutEmpresa}
                    onChange={(e) => setItauRutEmpresa(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createConnection.isPending}>
              {createConnection.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Crear Conexión
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
