-- Insert Cocina Grill & Restaurant stall
INSERT INTO stalls (name, email, location, owner_id, created_at, updated_at)
VALUES (
  'Cocina Grill & Restaurant',
  'cocina@gmail.com',
  'Bonoan Building, Ateneo de Naga University',
  'd83c66a2-884e-4916-af7a-7e998cdcfeb3',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;
