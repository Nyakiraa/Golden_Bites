-- Insert Bam-Bam's stall
-- Note: The user profile should be created first via the auth system
-- If manually inserting, ensure the auth user exists with email 'bambams@gmail.com'

-- Insert user profile if it doesn't exist (in case auto-trigger didn't fire)
INSERT INTO users (id, email, name, phone, avatar_url, created_at, updated_at)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'bambams@gmail.com' LIMIT 1),
  'bambams@gmail.com',
  'Bam-Bam''s',
  NULL,
  NULL,
  NOW(),
  NOW()
WHERE EXISTS (SELECT 1 FROM auth.users WHERE email = 'bambams@gmail.com')
ON CONFLICT (id) DO NOTHING;

-- Insert the stall record
INSERT INTO stalls (name, location, owner_id, email, phone, is_active)
SELECT
  'Bam-Bam''s',
  'Bonoan Building, Ateneo de Naga University',
  (SELECT id FROM auth.users WHERE email = 'bambams@gmail.com' LIMIT 1),
  'bambams@gmail.com',
  NULL,
  true
WHERE EXISTS (SELECT 1 FROM auth.users WHERE email = 'bambams@gmail.com')
ON CONFLICT (email) DO NOTHING;
