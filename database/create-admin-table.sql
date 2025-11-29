-- Create admin table to link users to stalls
-- Run this SQL in your Supabase SQL Editor

-- Create admin table
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stall_id UUID NOT NULL REFERENCES stalls(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, stall_id)
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);

-- Create index on stall_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_admins_stall_id ON admins(stall_id);

-- Enable Row Level Security (RLS) for admins
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own admin record
CREATE POLICY "Users can read their own admin record"
  ON admins
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow authenticated users to read admin records (for checking permissions)
CREATE POLICY "Authenticated users can read admin records"
  ON admins
  FOR SELECT
  TO authenticated
  USING (true);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at for admins
DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;
CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Verify the table was created
SELECT * FROM admins LIMIT 1;

