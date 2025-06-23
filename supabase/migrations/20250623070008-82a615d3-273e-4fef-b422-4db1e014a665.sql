
-- Create a table for coaching registrations
CREATE TABLE public.coaching_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_contact TEXT NOT NULL CHECK (preferred_contact IN ('Email', 'Phone', 'WhatsApp')),
  goals_challenges TEXT,
  privacy_accepted BOOLEAN NOT NULL DEFAULT true,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.coaching_registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (since this is for public registration)
CREATE POLICY "Anyone can register for coaching" 
  ON public.coaching_registrations 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy for admins to view all registrations
CREATE POLICY "Admins can view all coaching registrations" 
  ON public.coaching_registrations 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );
