import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, LogOut, List } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  user: any;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onSignOut }) => {
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
    <header className="w-full border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">PostRepublic</h1>
          </div>
          {/* Navigation Items */}
          <div className="flex items-center gap-6">
            <Link to="/orders">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <List size={16} />
                <span className="hidden sm:inline">My Orders</span>
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User size={16} />
              <span className="hidden md:inline max-w-32 truncate">{user?.email}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="flex items-center gap-1">
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 