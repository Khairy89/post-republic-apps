
-- Create a function to handle new order notifications
CREATE OR REPLACE FUNCTION notify_new_order()
RETURNS TRIGGER AS $$
BEGIN
  -- Call our edge function to send notification
  PERFORM
    net.http_post(
      url := 'https://clchnmmdbedbbbpjzola.supabase.co/functions/v1/notify-order',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsY2hubW1kYmVkYmJicGp6b2xhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5ODcyMTYsImV4cCI6MjA2NTU2MzIxNn0.dKMkQrn49l6cDF0_vSJSlT3GoPaHndXaES-_UZ0wnFE"}'::jsonb,
      body := json_build_object(
        'orderId', NEW.id,
        'recipientName', NEW.recipient_name,
        'country', NEW.country,
        'city', NEW.city,
        'state', NEW.state,
        'totalPrice', NEW.total_price,
        'weight', NEW.weight,
        'chargeableWeight', NEW.chargeable_weight,
        'basePrice', NEW.base_price,
        'fuelSurcharge', NEW.fuel_surcharge,
        'handlingFee', NEW.handling_fee,
        'repackingFee', NEW.repacking_fee,
        'phone', NEW.phone,
        'createdAt', NEW.created_at
      )::jsonb
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_notify_new_order ON shipping_orders;
CREATE TRIGGER trigger_notify_new_order
  AFTER INSERT ON shipping_orders
  FOR EACH ROW EXECUTE FUNCTION notify_new_order();

-- Enable the pg_net extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_net;
