
-- Add tracking_number column to shipping_orders table
ALTER TABLE public.shipping_orders 
ADD COLUMN tracking_number text;
