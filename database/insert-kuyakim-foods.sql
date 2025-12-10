-- Insert Kuya Kim Cuisine menu items

-- Snacks
INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kkcuisine@gmail.com' LIMIT 1),
  'Ginataang Bili-Bilo',
  NULL,
  25.00,
  'Snacks',
  true,
  1
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kkcuisine@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kkcuisine@gmail.com' LIMIT 1),
  'Biko',
  NULL,
  20.00,
  'Snacks',
  true,
  2
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kkcuisine@gmail.com');

-- Noodles
INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kkcuisine@gmail.com' LIMIT 1),
  'Spaghetti',
  NULL,
  35.00,
  'Noodles',
  true,
  3
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kkcuisine@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kkcuisine@gmail.com' LIMIT 1),
  'Carbonara',
  NULL,
  35.00,
  'Noodles',
  true,
  4
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kkcuisine@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kkcuisine@gmail.com' LIMIT 1),
  'Palabok',
  NULL,
  35.00,
  'Noodles',
  true,
  5
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kkcuisine@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kkcuisine@gmail.com' LIMIT 1),
  'Pansit Bato',
  NULL,
  20.00,
  'Noodles',
  true,
  6
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kkcuisine@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kkcuisine@gmail.com' LIMIT 1),
  'Bihon',
  NULL,
  35.00,
  'Noodles',
  true,
  7
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kkcuisine@gmail.com');

-- Main Dishes
INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kkcuisine@gmail.com' LIMIT 1),
  'Lumpiang Shanghai w/ Rice — 4pcs',
  NULL,
  50.00,
  'Main Dishes',
  true,
  8
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kkcuisine@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kkcuisine@gmail.com' LIMIT 1),
  'Chicken Curry w/ Rice',
  NULL,
  50.00,
  'Main Dishes',
  true,
  9
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kkcuisine@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kkcuisine@gmail.com' LIMIT 1),
  'Dinuguan w/ Rice',
  NULL,
  65.00,
  'Main Dishes',
  true,
  10
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kkcuisine@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kkcuisine@gmail.com' LIMIT 1),
  'Chicken Adobo w/ Rice',
  NULL,
  50.00,
  'Main Dishes',
  true,
  11
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kkcuisine@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kkcuisine@gmail.com' LIMIT 1),
  'Chicken Afritada w/ Rice',
  NULL,
  50.00,
  'Main Dishes',
  true,
  12
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kkcuisine@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kkcuisine@gmail.com' LIMIT 1),
  'Meat Balls w/ Rice',
  NULL,
  50.00,
  'Main Dishes',
  true,
  13
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kkcuisine@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kkcuisine@gmail.com' LIMIT 1),
  'Chicken w/ Rice',
  NULL,
  65.00,
  'Main Dishes',
  true,
  14
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kkcuisine@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kkcuisine@gmail.com' LIMIT 1),
  'Balunbalunan w/ Rice',
  NULL,
  65.00,
  'Main Dishes',
  true,
  15
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kkcuisine@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kkcuisine@gmail.com' LIMIT 1),
  'Chicken Strips w/ Rice',
  NULL,
  65.00,
  'Main Dishes',
  true,
  16
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kkcuisine@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kkcuisine@gmail.com' LIMIT 1),
  'Afritada w/ Rice',
  NULL,
  65.00,
  'Main Dishes',
  true,
  17
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kkcuisine@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kkcuisine@gmail.com' LIMIT 1),
  'Egado w/ Rice',
  NULL,
  65.00,
  'Main Dishes',
  true,
  18
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kkcuisine@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kkcuisine@gmail.com' LIMIT 1),
  'Pork Adobo w/ Rice',
  NULL,
  75.00,
  'Main Dishes',
  true,
  19
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kkcuisine@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kkcuisine@gmail.com' LIMIT 1),
  'Giniling w/ Rice',
  NULL,
  65.00,
  'Main Dishes',
  true,
  20
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kkcuisine@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kkcuisine@gmail.com' LIMIT 1),
  'Menudo w/ Rice',
  NULL,
  65.00,
  'Main Dishes',
  true,
  21
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kkcuisine@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kkcuisine@gmail.com' LIMIT 1),
  'Tokwa Sisig w/ Rice',
  NULL,
  65.00,
  'Main Dishes',
  true,
  22
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kkcuisine@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kkcuisine@gmail.com' LIMIT 1),
  'Vegetables w/ Rice',
  NULL,
  45.00,
  'Main Dishes',
  true,
  23
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kkcuisine@gmail.com');

INSERT INTO foods (stall_id, name, description, price, category, is_available, display_order)
SELECT 
  (SELECT id FROM stalls WHERE email = 'kkcuisine@gmail.com' LIMIT 1),
  'Fish w/ Rice',
  NULL,
  70.00,
  'Main Dishes',
  true,
  24
WHERE EXISTS (SELECT 1 FROM stalls WHERE email = 'kkcuisine@gmail.com');
