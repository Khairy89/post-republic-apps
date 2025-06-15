
-- Drop existing tables to recreate with proper structure
DROP TABLE IF EXISTS public.shipping_rates CASCADE;
DROP TABLE IF EXISTS public.shipping_zones CASCADE;
DROP TABLE IF EXISTS public.fuel_surcharge_rates CASCADE;

-- Create table for country to zone mapping
CREATE TABLE public.country_zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_name TEXT NOT NULL UNIQUE,
  country_code TEXT NOT NULL UNIQUE,
  zone_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for weight-based rates per zone (matching your CSV structure)
CREATE TABLE public.zone_weight_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  weight_kg DECIMAL(3,1) NOT NULL,
  zone_1 DECIMAL(10,2),
  zone_2 DECIMAL(10,2),
  zone_3 DECIMAL(10,2),
  zone_4 DECIMAL(10,2),
  zone_5 DECIMAL(10,2),
  zone_6 DECIMAL(10,2),
  zone_7 DECIMAL(10,2),
  zone_8 DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(weight_kg)
);

-- Create table for fuel surcharge rates
CREATE TABLE public.fuel_surcharge_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rate_percentage DECIMAL(5,2) NOT NULL DEFAULT 12.0,
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert sample data from your images
INSERT INTO public.zone_weight_rates (weight_kg, zone_1, zone_2, zone_3, zone_4, zone_5, zone_6, zone_7, zone_8) VALUES
(0.5, 72, 75, 76, 87, 90, 89, 154, 165),
(1.0, 77, 88, 89, 100, 100, 102, 189, 201),
(1.5, 83, 97, 98, 109, 111, 115, 224, 237),
(2.0, 89, 106, 107, 118, 122, 128, 259, 273),
(2.5, 95, 114, 115, 128, 132, 139, 292, 308),
(3.0, 101, 123, 124, 138, 145, 150, 325, 343),
(3.5, 107, 132, 133, 148, 158, 161, 358, 378),
(4.0, 113, 141, 142, 158, 171, 172, 391, 413),
(4.5, 119, 150, 151, 168, 184, 183, 424, 448),
(5.0, 125, 159, 160, 178, 197, 194, 457, 483);

-- Insert sample country mappings from your second image
INSERT INTO public.country_zones (country_name, country_code, zone_number) VALUES
('Afghanistan', 'AF', 8),
('Albania', 'AL', 7),
('Algeria', 'DZ', 8),
('American Samoa', 'AS', 8),
('Andorra', 'AD', 6),
('Angola', 'AO', 8),
('Anguilla', 'AI', 8),
('Antigua', 'AG', 8),
('Argentina', 'AR', 8),
('Armenia', 'AM', 8),
('Aruba', 'AW', 8),
('Australia', 'AU', 4),
('Austria', 'AT', 6),
('Azerbaijan', 'AZ', 8),
('Bahamas', 'BS', 8);

-- Insert current fuel surcharge rate
INSERT INTO public.fuel_surcharge_rates (rate_percentage) VALUES (12.0);

-- Enable RLS on all tables
ALTER TABLE public.country_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zone_weight_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_surcharge_rates ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access (since this is shipping rate data)
CREATE POLICY "Allow public read access to country zones" 
  ON public.country_zones FOR SELECT 
  TO public USING (true);

CREATE POLICY "Allow public read access to zone weight rates" 
  ON public.zone_weight_rates FOR SELECT 
  TO public USING (true);

CREATE POLICY "Allow public read access to fuel surcharge rates" 
  ON public.fuel_surcharge_rates FOR SELECT 
  TO public USING (true);

-- Create function to get rate for specific weight and zone
CREATE OR REPLACE FUNCTION public.get_shipping_rate(
  target_weight DECIMAL,
  target_zone INTEGER
) RETURNS DECIMAL AS $$
DECLARE
  rate DECIMAL;
  zone_column TEXT;
BEGIN
  -- Determine the zone column name
  zone_column := 'zone_' || target_zone::TEXT;
  
  -- Get rate for the weight (find the next higher weight bracket)
  EXECUTE format('
    SELECT %I FROM public.zone_weight_rates 
    WHERE weight_kg >= %L 
    ORDER BY weight_kg ASC 
    LIMIT 1
  ', zone_column, target_weight) INTO rate;
  
  RETURN COALESCE(rate, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
