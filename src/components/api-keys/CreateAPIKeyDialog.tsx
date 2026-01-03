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
      toast.error('Please enter a name for the API key');
      return;
    }

    try {
      const response = await createAPIKey.mutateAsync({
        name: name.trim(),
        expires_in_days: expiresInDays ? parseInt(expiresInDays, 10) : undefined,
      });
      toast.success('API key created');
      onKeyCreated(response.key);
      handleClose();
    } catch {
      toast.error('Failed to create API key');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
            <DialogDescription>
              Create a new API key for programmatic access to FinSnap
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Key Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Production Server"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                A descriptive name to identify this key
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expires">Expires In (days)</Label>
              <Input
                id="expires"
                type="number"
                placeholder="Optional - leave blank for no expiration"
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(e.target.value)}
                min="1"
                max="365"
              />
              <p className="text-xs text-muted-foreground">
                Number of days until the key expires (1-365)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createAPIKey.isPending}>
              {createAPIKey.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Key
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
