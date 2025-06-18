import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';

export const useShippingOrders = () => {
  const { isAdmin, loading } = useUserRole();
  
  return useQuery({
    queryKey: ['shipping-orders', isAdmin],
    queryFn: async () => {
      let query = supabase
        .from('shipping_orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      // If not admin, only show user's own orders
      if (!isAdmin) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          query = query.eq('user_id', user.id);
        }
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !loading, // Wait for role loading to complete
  });
};

export const useCreateShippingOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (orderData: any) => {
      // Retry function with token refresh
      const attemptCreateOrder = async (retryCount = 0): Promise<any> => {
        try {
          const { data, error } = await supabase
            .from('shipping_orders')
            .insert([orderData])
            .select()
            .single();
          
          if (error) throw error;
          return data;
        } catch (error: any) {
          // If JWT expired and we haven't retried yet, try to refresh token and retry
          if (error.code === 'PGRST301' && retryCount === 0) {
            console.log('JWT expired, attempting to refresh token and retry...');
            
            const { error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) {
              console.error('Token refresh failed:', refreshError);
              throw error; // Throw original error if refresh fails
            }
            
            console.log('Token refreshed, retrying order creation...');
            return attemptCreateOrder(1); // Retry once
          }
          
          throw error;
        }
      };

      return attemptCreateOrder();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shipping-orders'] });
      console.log('Order created successfully with database trigger notification:', data.id);
    },
    onError: (error: any) => {
      console.error('Order creation failed:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to create order. Please try again.';
      if (error.code === 'PGRST301') {
        errorMessage = 'Your session has expired. Please refresh the page and try again.';
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });
};
