-- Create feedback table for storing user feedback
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert feedback (public form)
CREATE POLICY "Anyone can insert feedback" ON public.feedback
  FOR INSERT
  WITH CHECK (true);

-- Only allow reading feedback for authenticated users (e.g., admin)
CREATE POLICY "Authenticated users can read feedback" ON public.feedback
  FOR SELECT
  USING (auth.role() = 'authenticated');
