-- SQL script to manually insert RC FOOD STALL record
-- Run this in Supabase SQL Editor after the auth user is created
-- 
-- User ID: cd88f2ba-253b-4a0b-a25d-db691552210b
-- Email: rcfoodstall@gmail.com

-- Insert the stall record
INSERT INTO stalls (
  name,
  location,
  owner_id,
  email,
  phone,
  is_active,
  created_at
) VALUES (
  'RC FOOD STALL',
  'Bonoan Building, Ateneo de Naga University',
  'cd88f2ba-253b-4a0b-a25d-db691552210b'::uuid,
  'rcfoodstall@gmail.com',
  '+639123456789',
  true,
  NOW()
)
ON CONFLICT (email) DO UPDATE
SET
  name = EXCLUDED.name,
  location = EXCLUDED.location,
  owner_id = EXCLUDED.owner_id,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- Verify the insert
SELECT * FROM stalls WHERE email = 'rcfoodstall@gmail.com';

