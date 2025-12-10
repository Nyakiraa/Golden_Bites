-- Link Bam-Bam's admin user to stall
-- This script should be run AFTER the auth user is created and the stall is inserted

INSERT INTO admins (user_id, stall_id)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'bambams@gmail.com' LIMIT 1),
  (SELECT id FROM stalls WHERE email = 'bambams@gmail.com' LIMIT 1)
WHERE EXISTS (SELECT 1 FROM auth.users WHERE email = 'bambams@gmail.com')
  AND EXISTS (SELECT 1 FROM stalls WHERE email = 'bambams@gmail.com')
ON CONFLICT (user_id, stall_id) DO NOTHING;
