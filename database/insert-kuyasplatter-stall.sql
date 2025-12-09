-- Insert Kuya's Platter stall
INSERT INTO stalls (name, location, email, phone, is_active)
VALUES (
  'Kuya''s Platter',
  'Bonoan Building, Ateneo de Naga University',
  'kplatter@gmail.com',
  NULL,
  true
)
ON CONFLICT (email) DO NOTHING;
