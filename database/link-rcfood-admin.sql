-- Link rcfood@gmail.com user to RC FOOD STALL as admin
-- Run this SQL in your Supabase SQL Editor
-- This will create an admin record linking the user to the stall

DO $$
DECLARE
  v_user_id UUID;
  v_stall_id UUID;
BEGIN
  -- Get the user ID for rcfood@gmail.com
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'rcfood@gmail.com'
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email rcfood@gmail.com not found. Please make sure the user exists in auth.users';
  END IF;

  -- Get the stall ID for RC FOOD STALL
  SELECT id INTO v_stall_id
  FROM stalls
  WHERE name = 'RC FOOD STALL'
  LIMIT 1;

  IF v_stall_id IS NULL THEN
    RAISE EXCEPTION 'RC FOOD STALL not found. Please create the stall first or update the stall name in this script.';
  END IF;

  -- Insert or update the admin record
  INSERT INTO admins (user_id, stall_id, created_at, updated_at)
  VALUES (v_user_id, v_stall_id, NOW(), NOW())
  ON CONFLICT (user_id, stall_id) DO UPDATE
  SET updated_at = NOW();

  RAISE NOTICE 'Successfully linked rcfood@gmail.com to RC FOOD STALL as admin';
END $$;

-- Verify the link
SELECT 
  a.id as admin_id,
  a.user_id,
  a.stall_id,
  u.email as user_email,
  s.name as stall_name,
  s.location as stall_location
FROM admins a
LEFT JOIN auth.users u ON a.user_id = u.id
LEFT JOIN stalls s ON a.stall_id = s.id
WHERE u.email = 'rcfood@gmail.com';

