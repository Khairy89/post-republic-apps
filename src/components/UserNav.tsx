
import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, LogOut, List } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserNavProps {
  user: any;
  onSignOut: () => void;
}

const UserNav: React.FC<UserNavProps> = ({ user, onSignOut }) => {
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Signed out successfully' });
      onSignOut();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <Link to="/orders">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <List size={16} />
            <span className="hidden sm:inline">My Orders</span>
          </Button>
        </Link>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          <LogOut size={16} className="sm:mr-2" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
      <div className="flex flex-row items-center gap-2 text-sm">
        <User size={20} />
        <span className="sm:inline">{user?.email}</span>
      </div>
    </div>
  );
};

export default UserNav;
