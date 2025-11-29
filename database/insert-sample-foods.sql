-- SQL script to insert sample food items for RC FOOD STALL
-- Run this in Supabase SQL Editor after creating the stall record
--
-- Note: Replace 'YOUR_STALL_ID' with the actual UUID of RC FOOD STALL
-- You can find it by running: SELECT id FROM stalls WHERE name = 'RC FOOD STALL';

-- Insert bihon and other sample items for RC FOOD STALL
-- Replace 'YOUR_STALL_ID' with the actual stall UUID
INSERT INTO foods (
  stall_id,
  name,
  description,
  price,
  image_url,
  category,
  is_available,
  display_order
) VALUES
  (
    (SELECT id FROM stalls WHERE name = 'RC FOOD STALL' LIMIT 1),
    'Bihon',
    'Delicious stir-fried rice noodles with vegetables and your choice of meat',
    45.00,
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80&auto=format&fit=crop',
    'Main Course',
    true,
    1
  ),
  (
    (SELECT id FROM stalls WHERE name = 'RC FOOD STALL' LIMIT 1),
    'Pancake',
    'Fluffy and golden pancakes served with butter and syrup',
    20.00,
    'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=500&q=80&auto=format&fit=crop',
    'Breakfast',
    true,
    2
  ),
  (
    (SELECT id FROM stalls WHERE name = 'RC FOOD STALL' LIMIT 1),
    'Lumpiang Shanghai',
    'Crispy spring rolls filled with ground pork and vegetables',
    20.00,
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&q=80&auto=format&fit=crop',
    'Appetizer',
    true,
    3
  ),
  (
    (SELECT id FROM stalls WHERE name = 'RC FOOD STALL' LIMIT 1),
    'Waffle',
    'Crispy on the outside, soft on the inside, served with your favorite toppings',
    20.00,
    'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500&q=80&auto=format&fit=crop',
    'Breakfast',
    true,
    4
  )
ON CONFLICT DO NOTHING;

-- Verify the insert
SELECT 
  f.id,
  f.name,
  f.description,
  f.price,
  s.name AS stall_name
FROM foods f
INNER JOIN stalls s ON f.stall_id = s.id
WHERE s.name = 'RC FOOD STALL'
ORDER BY f.display_order;

