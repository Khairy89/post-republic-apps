
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useShippingRates = () => {
  return useQuery({
    queryKey: ['shipping-rates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('zone_weight_rates')
        .select('*')
        .order('weight_kg', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCountryZones = () => {
  return useQuery({
    queryKey: ['country-zones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('country_zones')
        .select('*')
        .order('country_name', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useFuelSurcharge = () => {
  return useQuery({
    queryKey: ['fuel-surcharge'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fuel_surcharge_rates')
        .select('*')
        .order('effective_date', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data;
    },
  });
};
