-- Link rcfood@gmail.com user to RC FOOD STALL
-- Run this SQL in your Supabase SQL Editor
-- This will update or create the stall record linked to the rcfood@gmail.com user

-- Check if the user exists
DO $$
DECLARE
  user_id UUID;
  stall_exists BOOLEAN;
BEGIN
  -- Get the user ID for rcfood@gmail.com
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = 'rcfood@gmail.com'
  LIMIT 1;

  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User with email rcfood@gmail.com not found. Please make sure the user exists in auth.users';
  END IF;

  -- Check if RC FOOD STALL already exists
  SELECT EXISTS(SELECT 1 FROM stalls WHERE name = 'RC FOOD STALL') INTO stall_exists;

  IF stall_exists THEN
    -- Update existing stall to link to rcfood@gmail.com
    UPDATE stalls
    SET 
      owner_id = user_id,
      email = 'rcfood@gmail.com',
      updated_at = NOW()
    WHERE name = 'RC FOOD STALL';
    
    RAISE NOTICE 'Updated existing RC FOOD STALL to link to rcfood@gmail.com';
  ELSE
    -- Create new stall record
    INSERT INTO stalls (
      name,
      location,
      owner_id,
      email,
      phone,
      is_active,
      created_at,
      updated_at
    )
    VALUES (
      'RC FOOD STALL',
      'Bonoan Building, Ateneo de Naga University',
      user_id,
      'rcfood@gmail.com',
      NULL,
      true,
      NOW(),
      NOW()
    )
    ON CONFLICT (email) DO UPDATE
    SET
      owner_id = EXCLUDED.owner_id,
      name = EXCLUDED.name,
      location = EXCLUDED.location,
      updated_at = NOW();
    
    RAISE NOTICE 'Created new RC FOOD STALL linked to rcfood@gmail.com';
  END IF;
END $$;

-- Verify the link
SELECT 
  s.id as stall_id,
  s.name as stall_name,
  s.location,
  s.owner_id,
  s.email as stall_email,
  u.email as user_email,
  u.id as user_id
FROM stalls s
LEFT JOIN auth.users u ON s.owner_id = u.id
WHERE s.name = 'RC FOOD STALL' OR s.email = 'rcfood@gmail.com';

