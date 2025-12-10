-- Link Noodle House admin user to stall
-- This script should be run AFTER the stall is inserted

INSERT INTO admins (user_id, stall_id)
SELECT 
  'a3b759df-c9fe-4b63-aed0-c1978ca00623',
  (SELECT id FROM stalls WHERE email = 'noodles@gmail.com' LIMIT 1)
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'noodles@gmail.com')
ON CONFLICT (user_id, stall_id) DO NOTHING;
