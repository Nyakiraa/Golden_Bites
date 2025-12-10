-- Link Cocina Grill & Restaurant admin user to stall
-- This script should be run AFTER the stall is inserted

INSERT INTO admins (user_id, stall_id)
SELECT 
  'd83c66a2-884e-4916-af7a-7e998cdcfeb3',
  (SELECT id FROM stalls WHERE email = 'cocina@gmail.com' LIMIT 1)
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'cocina@gmail.com')
ON CONFLICT (user_id, stall_id) DO NOTHING;
