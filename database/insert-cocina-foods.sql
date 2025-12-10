-- Get stall ID for Cocina Grill & Restaurant
WITH cocina_stall AS (
  SELECT id FROM stalls WHERE owner_id = 'd83c66a2-884e-4916-af7a-7e998cdcfeb3' LIMIT 1
)
INSERT INTO foods (stall_id, name, price, category, created_at, updated_at)
SELECT 
  cocina_stall.id,
  name,
  price,
  category,
  NOW(),
  NOW()
FROM cocina_stall,
(VALUES
  -- Noodles
  ('Sotanghon', 40, 'Noodles'),
  ('Palabok', 40, 'Noodles'),
  
  -- Main Dishes
  ('Pork Tapa w/ Rice + juice', 75, 'Main Dishes'),
  ('Pork Adobo w/ Rice + juice', 75, 'Main Dishes'),
  ('Cordon Bleu w/ Rice + juice', 75, 'Main Dishes'),
  ('Fried Chicken w/ Rice + juice', 75, 'Main Dishes'),
  ('Menudo w/ Rice + juice', 75, 'Main Dishes'),
  
  -- Breakfast
  ('Java Rice + Egg', 40, 'Breakfast'),
  ('Java Rice + Sausage', 60, 'Breakfast'),
  ('Java Rice + Skinless', 40, 'Breakfast'),
  ('Java Rice + Torta', 50, 'Breakfast'),
  ('Java Rice + TenderJuicy Hotdog', 45, 'Breakfast'),
  ('Java Rice + Maling', 40, 'Breakfast')
) AS t(name, price, category)
ON CONFLICT DO NOTHING;
