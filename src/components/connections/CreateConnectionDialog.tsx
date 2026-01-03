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
  { value: 'sii', label: 'SII (Tax Service)' },
  { value: 'bank_itau', label: 'Banco Itau' },
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
      toast.error('Please fill in all required fields');
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
      toast.success('Connection created successfully');
      handleClose();
    } catch {
      toast.error('Failed to create connection');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Connection</DialogTitle>
            <DialogDescription>
              Connect a new data source to sync your financial data
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="type">Connection Type *</Label>
              <Select
                value={connectionType}
                onValueChange={(value) => setConnectionType(value as ConnectionType)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
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
              <Label htmlFor="name">Connection Name *</Label>
              <Input
                id="name"
                placeholder="e.g., My Company SII"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook">Webhook URL (optional)</Label>
              <Input
                id="webhook"
                type="url"
                placeholder="https://your-server.com/webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Receive notifications when sync completes
              </p>
            </div>

            {/* SII Credentials */}
            {connectionType === 'sii' && (
              <div className="space-y-4 rounded-lg border p-4">
                <h4 className="font-medium">SII Credentials</h4>
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
                  <Label htmlFor="sii-password">Password *</Label>
                  <Input
                    id="sii-password"
                    type="password"
                    placeholder="SII password"
                    value={siiPassword}
                    onChange={(e) => setSiiPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Itau Credentials */}
            {connectionType === 'bank_itau' && (
              <div className="space-y-4 rounded-lg border p-4">
                <h4 className="font-medium">Banco Itau Credentials</h4>
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
                    placeholder="Bank password"
                    value={itauClave}
                    onChange={(e) => setItauClave(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="itau-empresa">RUT Empresa (optional)</Label>
                  <Input
                    id="itau-empresa"
                    placeholder="Company RUT if different"
                    value={itauRutEmpresa}
                    onChange={(e) => setItauRutEmpresa(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createConnection.isPending}>
              {createConnection.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Connection
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
