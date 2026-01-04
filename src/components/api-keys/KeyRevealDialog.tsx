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
import { toast } from 'sonner';
import { Copy, Check, AlertTriangle } from 'lucide-react';

interface KeyRevealDialogProps {
  apiKey: string | null;
  onClose: () => void;
}

export function KeyRevealDialog({ apiKey, onClose }: KeyRevealDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!apiKey) return;

    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      toast.success('Clave API copiada al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Error al copiar al portapapeles');
    }
  };

  const handleClose = () => {
    setCopied(false);
    onClose();
  };

  return (
    <Dialog open={!!apiKey} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Guarda tu Clave API
          </DialogTitle>
          <DialogDescription>
            Esta es la única vez que verás esta clave. Asegúrate de copiarla
            ahora y guardarla de forma segura.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Esta clave no se mostrará nuevamente
              </p>
            </div>
            <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
              Si pierdes esta clave, deberás crear una nueva.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                readOnly
                value={apiKey || ''}
                className="font-mono text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleClose}>
            Ya guardé mi clave
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
