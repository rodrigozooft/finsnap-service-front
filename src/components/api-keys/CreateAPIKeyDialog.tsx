import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateAPIKey } from '@/hooks/useAPIKeys';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface CreateAPIKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onKeyCreated: (key: string) => void;
}

export function CreateAPIKeyDialog({
  open,
  onOpenChange,
  onKeyCreated,
}: CreateAPIKeyDialogProps) {
  const [name, setName] = useState('');
  const [expiresInDays, setExpiresInDays] = useState('');

  const createAPIKey = useCreateAPIKey();

  const resetForm = () => {
    setName('');
    setExpiresInDays('');
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Por favor ingresa un nombre para la clave API');
      return;
    }

    try {
      const response = await createAPIKey.mutateAsync({
        name: name.trim(),
        expires_in_days: expiresInDays ? parseInt(expiresInDays, 10) : undefined,
      });
      toast.success('Clave API creada');
      onKeyCreated(response.key);
      handleClose();
    } catch {
      toast.error('Error al crear la clave API');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear Clave API</DialogTitle>
            <DialogDescription>
              Crea una nueva clave API para acceso programático a FinSnap
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Clave *</Label>
              <Input
                id="name"
                placeholder="ej., Servidor de Producción"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Un nombre descriptivo para identificar esta clave
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expires">Expira en (días)</Label>
              <Input
                id="expires"
                type="number"
                placeholder="Opcional - dejar vacío para sin expiración"
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(e.target.value)}
                min="1"
                max="365"
              />
              <p className="text-xs text-muted-foreground">
                Número de días hasta que la clave expire (1-365)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createAPIKey.isPending}>
              {createAPIKey.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Crear Clave
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
