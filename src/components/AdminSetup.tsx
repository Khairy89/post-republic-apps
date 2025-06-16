
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminSetup: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  if (!user) {
    return null;
  }

  const copyUserId = () => {
    navigator.clipboard.writeText(user.id);
    toast({
      title: "Copied!",
      description: "User ID copied to clipboard",
    });
  };

  return (
    <div className="p-4 border rounded-lg bg-muted/50 mb-4">
      <h3 className="font-semibold mb-2">Admin Setup Required</h3>
      <p className="text-sm text-muted-foreground mb-3">
        To enable admin access for tracking number editing, run this SQL command in your Supabase SQL editor:
      </p>
      <div className="bg-background p-3 rounded border mb-3">
        <code className="text-sm">
          INSERT INTO public.user_roles (user_id, role) VALUES ('{user.id}', 'admin');
        </code>
      </div>
      <Button onClick={copyUserId} variant="outline" size="sm">
        <Copy className="h-3 w-3 mr-1" />
        Copy User ID
      </Button>
      <p className="text-xs text-muted-foreground mt-2">
        Your User ID: {user.id}
      </p>
    </div>
  );
};

export default AdminSetup;
