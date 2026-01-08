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
import { useCreateLinkToken } from '@/hooks/useLinkToken';
import { useConnect } from '@/hooks/useConnect';
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

  const createLinkToken = useCreateLinkToken();
  const { openConnect } = useConnect({
    onSuccess: () => {
      handleClose();
    },
  });

  const resetForm = () => {
    setConnectionType('');
    setName('');
    setWebhookUrl('');
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
      const { link_token } = await createLinkToken.mutateAsync({
        connection_type: connectionType,
        name,
        webhook_url: webhookUrl || undefined,
      });

      // Open SDK modal with the link token
      openConnect(link_token);
    } catch {
      toast.error('Error al iniciar la conexión');
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
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createLinkToken.isPending}>
              {createLinkToken.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Continuar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
