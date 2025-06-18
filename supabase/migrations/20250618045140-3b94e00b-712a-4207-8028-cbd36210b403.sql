
-- Add payment_status column to shipping_orders table
ALTER TABLE public.shipping_orders 
ADD COLUMN payment_status text DEFAULT 'pending';

-- Add a comment to document the possible values
COMMENT ON COLUMN public.shipping_orders.payment_status IS 'Payment status: pending, paid, failed';
