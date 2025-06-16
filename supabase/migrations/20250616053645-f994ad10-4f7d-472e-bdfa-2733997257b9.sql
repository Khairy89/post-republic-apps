
-- Create an enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy for user_roles (users can view their own roles)
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow admins to manage all user roles
CREATE POLICY "Admins can manage all user roles"
  ON public.user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert your user as admin (replace with your actual user ID)
-- You'll need to get your user ID from the auth.users table after running this migration
-- INSERT INTO public.user_roles (user_id, role) VALUES ('your-user-id-here', 'admin');

-- Update shipping_orders RLS policies to allow admins to update tracking numbers
DROP POLICY IF EXISTS "Users can update their own orders" ON public.shipping_orders;

-- Users can update their own orders (excluding tracking_number)
CREATE POLICY "Users can update their own orders"
  ON public.shipping_orders
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can update tracking numbers for any order
CREATE POLICY "Admins can update tracking numbers"
  ON public.shipping_orders
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));
