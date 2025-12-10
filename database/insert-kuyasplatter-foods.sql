-- Insert Kuya's Platter menu items
-- First, get the stall_id for Kuya's Platter and insert all foods

-- Beverages
INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Iced Tea (10oz)',
  NULL,
  20.00,
  'Beverages',
  true,
  1
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Iced Tea (12oz)',
  NULL,
  25.00,
  'Beverages',
  true,
  2
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Iced Tea (16oz)',
  NULL,
  30.00,
  'Beverages',
  true,
  3
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Blue Lemonade (10oz)',
  NULL,
  20.00,
  'Beverages',
  true,
  4
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Blue Lemonade (12oz)',
  NULL,
  25.00,
  'Beverages',
  true,
  5
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Blue Lemonade (16oz)',
  NULL,
  30.00,
  'Beverages',
  true,
  6
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Buko Juice',
  NULL,
  35.00,
  'Beverages',
  true,
  7
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

-- Food Items
INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Pancit',
  NULL,
  35.00,
  'Food',
  true,
  8
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Bihon',
  NULL,
  35.00,
  'Food',
  true,
  9
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Palabok',
  NULL,
  35.00,
  'Food',
  true,
  10
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Sandwich',
  NULL,
  25.00,
  'Food',
  true,
  11
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Hotdog (Large)',
  NULL,
  20.00,
  'Food',
  true,
  12
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Hotdog (Medium)',
  NULL,
  15.00,
  'Food',
  true,
  13
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Boiled Egg',
  NULL,
  15.00,
  'Food',
  true,
  14
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Lumpia (3pcs)',
  NULL,
  25.00,
  'Food',
  true,
  15
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Fish Okoy',
  NULL,
  35.00,
  'Food',
  true,
  16
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Fried Chicken',
  NULL,
  50.00,
  'Food',
  true,
  17
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Turon',
  NULL,
  25.00,
  'Food',
  true,
  18
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Banana Que',
  NULL,
  25.00,
  'Food',
  true,
  19
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Camote Que',
  NULL,
  25.00,
  'Food',
  true,
  20
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Hegado',
  NULL,
  55.00,
  'Food',
  true,
  21
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Bopis',
  NULL,
  55.00,
  'Food',
  true,
  22
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Dinuguan',
  NULL,
  55.00,
  'Food',
  true,
  23
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Ginataang Gulay',
  NULL,
  30.00,
  'Food',
  true,
  24
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Vegetable Guisado',
  NULL,
  25.00,
  'Food',
  true,
  25
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Kare-Kare',
  NULL,
  65.00,
  'Food',
  true,
  26
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Kaldereta',
  NULL,
  65.00,
  'Food',
  true,
  27
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Giniling',
  NULL,
  55.00,
  'Food',
  true,
  28
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Curry',
  NULL,
  55.00,
  'Food',
  true,
  29
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Steak',
  NULL,
  55.00,
  'Food',
  true,
  30
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1),
  'Adobo',
  NULL,
  55.00,
  'Food',
  true,
  31
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');
