
-- Enable RLS on reference tables that are missing it (ignore if already enabled)
DO $$ 
BEGIN
    -- Enable RLS on tables if not already enabled
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'country_zones') THEN
        ALTER TABLE public.country_zones ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'zone_weight_rates') THEN
        ALTER TABLE public.zone_weight_rates ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'fuel_surcharge_rates') THEN
        ALTER TABLE public.fuel_surcharge_rates ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create secure policies for zone_weight_rates (drop and recreate to ensure consistency)
DROP POLICY IF EXISTS "Allow public read access to zone weight rates" ON public.zone_weight_rates;
CREATE POLICY "Allow public read access to zone weight rates" 
  ON public.zone_weight_rates FOR SELECT 
  TO public USING (true);

DROP POLICY IF EXISTS "Only service role can modify zone weight rates" ON public.zone_weight_rates;
CREATE POLICY "Only service role can modify zone weight rates" 
  ON public.zone_weight_rates FOR ALL 
  TO service_role USING (true);

-- Create secure policies for fuel_surcharge_rates (drop and recreate to ensure consistency)
DROP POLICY IF EXISTS "Allow public read access to fuel surcharge rates" ON public.fuel_surcharge_rates;
CREATE POLICY "Allow public read access to fuel surcharge rates" 
  ON public.fuel_surcharge_rates FOR SELECT 
  TO public USING (true);

DROP POLICY IF EXISTS "Only service role can modify fuel surcharge rates" ON public.fuel_surcharge_rates;
CREATE POLICY "Only service role can modify fuel surcharge rates" 
  ON public.fuel_surcharge_rates FOR ALL 
  TO service_role USING (true);

-- Add missing RLS policies for profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Add missing RLS policies for shipping_orders table
DROP POLICY IF EXISTS "Users can view their own orders" ON public.shipping_orders;
CREATE POLICY "Users can view their own orders" 
  ON public.shipping_orders 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own orders" ON public.shipping_orders;
CREATE POLICY "Users can create their own orders" 
  ON public.shipping_orders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own orders" ON public.shipping_orders;
CREATE POLICY "Users can update their own orders" 
  ON public.shipping_orders 
  FOR UPDATE 
  USING (auth.uid() = user_id);
