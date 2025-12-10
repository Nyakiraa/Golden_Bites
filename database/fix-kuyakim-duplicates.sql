-- Remove duplicate food items for Kuya Kim Cuisine
-- This script identifies and deletes duplicate entries keeping only the first one

DELETE FROM foods
WHERE id IN (
  SELECT id FROM (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY stall_id, name, price 
        ORDER BY created_at ASC
      ) as rn
    FROM foods
    WHERE stall_id = (SELECT id FROM stalls WHERE email = 'kkcuisine@gmail.com' LIMIT 1)
  ) t
  WHERE rn > 1
);

-- Verify the cleanup
SELECT COUNT(*) as total_items FROM foods 
WHERE stall_id = (SELECT id FROM stalls WHERE email = 'kkcuisine@gmail.com' LIMIT 1);
