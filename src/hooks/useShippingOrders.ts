
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useShippingOrders = () => {
  return useQuery({
    queryKey: ['shipping-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shipping_orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateShippingOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (orderData: any) => {
      const { data, error } = await supabase
        .from('shipping_orders')
        .insert([orderData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shipping-orders'] });
      console.log('Order created successfully with database trigger notification:', data.id);
    },
    onError: (error: any) => {
      console.error('Order creation failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to create order. Please try again.',
        variant: 'destructive',
      });
    },
  });
};
