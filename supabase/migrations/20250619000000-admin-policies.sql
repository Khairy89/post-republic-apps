-- Add policy for admins to view all orders
CREATE POLICY "Admins can view all orders"
  ON public.shipping_orders
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Add policy for admins to update payment status
CREATE POLICY "Admins can update payment status"
  ON public.shipping_orders
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin')); 