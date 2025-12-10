-- Link Kuya's Platter user to stall as owner
-- Update the owner_id in stalls table for Kuya's Platter

UPDATE stalls
SET owner_id = (SELECT id FROM auth.users WHERE email = 'kplatter@gmail.com' LIMIT 1)
WHERE email = 'kplatter@gmail.com'
  AND EXISTS (SELECT 1 FROM auth.users WHERE email = 'kplatter@gmail.com');

-- Verify the update
SELECT id, name, email, owner_id FROM stalls WHERE email = 'kplatter@gmail.com';
