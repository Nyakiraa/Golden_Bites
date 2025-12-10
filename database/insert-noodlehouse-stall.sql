-- Insert Noodle House stall
INSERT INTO stalls (name, email, location, owner_id, created_at, updated_at)
VALUES (
  'Noodle House',
  'noodles@gmail.com',
  'Bonoan Building, Ateneo de Naga University',
  'a3b759df-c9fe-4b63-aed0-c1978ca00623',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;
