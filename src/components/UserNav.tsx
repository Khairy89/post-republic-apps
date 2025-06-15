import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, LogOut } from 'lucide-react';
interface UserNavProps {
  user: any;
  onSignOut: () => void;
}
const UserNav: React.FC<UserNavProps> = ({
  user,
  onSignOut
}) => {
  const {
    toast
  } = useToast();
  const handleSignOut = async () => {
    const {
      error
    } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Signed out successfully'
      });
      onSignOut();
    }
  };
  return <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm px-[10px] rounded-none">
        <User size={16} />
        <span className="hidden sm:inline">{user?.email}</span>
      </div>
      <Button variant="outline" size="sm" onClick={handleSignOut}>
        <LogOut size={16} className="sm:mr-2" />
        <span className="hidden sm:inline">Sign Out</span>
      </Button>
    </div>;
};
export default UserNav;