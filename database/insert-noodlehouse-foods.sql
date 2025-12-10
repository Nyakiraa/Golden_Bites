-- Get stall ID for Noodle House
WITH noodlehouse_stall AS (
  SELECT id FROM stalls WHERE owner_id = 'a3b759df-c9fe-4b63-aed0-c1978ca00623' LIMIT 1
)
INSERT INTO foods (stall_id, name, price, category, created_at, updated_at)
SELECT 
  noodlehouse_stall.id,
  name,
  price,
  category,
  NOW(),
  NOW()
FROM noodlehouse_stall,
(VALUES
  -- Fried Noodles
  ('Fried Noodles', 40, 'Fried Noodles'),
  ('Sharksfin Siomai', 58, 'Fried Noodles'),
  ('Pork Siomai', 55, 'Fried Noodles'),
  ('Beef Siomai', 55, 'Fried Noodles'),
  ('Wanton Siomai', 58, 'Fried Noodles'),
  ('Beef Teriyaki', 60, 'Fried Noodles'),
  
  -- Rice Meals
  ('Fried Rice w/ Siomai', 53, 'Rice Meals'),
  ('Fried Rice w/ Beef Teriyaki', 63, 'Rice Meals'),
  ('Plain Rice w/ Siomai', 43, 'Rice Meals'),
  ('Plain Rice w/ Beef Teriyaki', 53, 'Rice Meals'),
  ('Tapsilog', 70, 'Rice Meals'),
  ('Hotsilog', 60, 'Rice Meals'),
  ('Longsilog', 60, 'Rice Meals'),
  ('Hamsilog', 60, 'Rice Meals'),
  
  -- Rice meals + Black Gulaman Combo
  ('Fried Rice w/ Siomai + Black Gulaman Combo', 68, 'Rice meals + Black Gulaman Combo'),
  ('Fried Rice w/ Beef Teriyaki + Black Gulaman Combo', 78, 'Rice meals + Black Gulaman Combo'),
  ('Plain Rice w/ Siomai + Black Gulaman Combo', 58, 'Rice meals + Black Gulaman Combo'),
  ('Plain Rice w/ Beef Teriyaki + Black Gulaman Combo', 68, 'Rice meals + Black Gulaman Combo'),
  
  -- Siomai 5pcs
  ('Beef Siomai 5pcs', 33, 'Siomai 5pcs'),
  ('Pork Siomai 5pcs', 33, 'Siomai 5pcs'),
  ('Chicken Siomai 5pcs', 33, 'Siomai 5pcs'),
  ('Japanese Siomai 5pcs', 35, 'Siomai 5pcs'),
  
  -- Others
  ('Adobo / BolaBola', 30, 'Others'),
  ('Asado Siopao', 28, 'Others'),
  
  -- Graham Bars
  ('Graham Bars - Cookies and Cream', 30, 'Graham Bars'),
  ('Graham Bars - Mango Flavor', 30, 'Graham Bars'),
  ('Graham Bars - Matcha Oreo', 30, 'Graham Bars'),
  ('Graham Bars - Choco Mallows', 30, 'Graham Bars'),
  ('Graham Bars - Strawberry', 30, 'Graham Bars'),
  ('Graham Bars - Ube Mallows', 30, 'Graham Bars')
) AS t(name, price, category)
ON CONFLICT DO NOTHING;
