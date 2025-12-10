-- Create Kuya's Platter admin user profile
-- This script creates the user profile in the users table after the auth user is created

-- Insert or update the user profile for kplatter@gmail.com
INSERT INTO users (id, email, name, phone, created_at, updated_at)
SELECT 
  id,
  email,
  'Kuya''s Platter',
  NULL,
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'kplatter@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  name = 'Kuya''s Platter',
  email = 'kplatter@gmail.com',
  updated_at = NOW();
