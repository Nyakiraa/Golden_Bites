-- Update Cocina Grill & Restaurant menu items with image URLs from storage
-- Images are stored in: menu-images/cocina/ folder in Supabase storage

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/cocina/sotanghon.png'
WHERE name = 'Sotanghon' AND stall_id = (SELECT id FROM stalls WHERE email = 'cocina@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/cocina/palabok.jpg'
WHERE name = 'Palabok' AND stall_id = (SELECT id FROM stalls WHERE email = 'cocina@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/cocina/pork%20tapa.jpg'
WHERE name = 'Pork Tapa w/ Rice + juice' AND stall_id = (SELECT id FROM stalls WHERE email = 'cocina@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/cocina/pork%20adobo.jpg'
WHERE name = 'Pork Adobo w/ Rice + juice' AND stall_id = (SELECT id FROM stalls WHERE email = 'cocina@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/cocina/cordon%20bleu.jpg'
WHERE name = 'Cordon Bleu w/ Rice + juice' AND stall_id = (SELECT id FROM stalls WHERE email = 'cocina@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/cocina/fried%20chicken.png'
WHERE name = 'Fried Chicken w/ Rice + juice' AND stall_id = (SELECT id FROM stalls WHERE email = 'cocina@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/cocina/menudo.jpg'
WHERE name = 'Menudo w/ Rice + juice' AND stall_id = (SELECT id FROM stalls WHERE email = 'cocina@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/cocina/javaricewith%20egg.jpg'
WHERE name = 'Java Rice + Egg' AND stall_id = (SELECT id FROM stalls WHERE email = 'cocina@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/cocina/javawithsausage.png'
WHERE name = 'Java Rice + Sausage' AND stall_id = (SELECT id FROM stalls WHERE email = 'cocina@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/cocina/javawithskinless.jpg'
WHERE name = 'Java Rice + Skinless' AND stall_id = (SELECT id FROM stalls WHERE email = 'cocina@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/cocina/javaricewith%20egg.jpg'
WHERE name = 'Java Rice + Torta' AND stall_id = (SELECT id FROM stalls WHERE email = 'cocina@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/cocina/javawithhotdog.jpg'
WHERE name = 'Java Rice + TenderJuicy Hotdog' AND stall_id = (SELECT id FROM stalls WHERE email = 'cocina@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/cocina/javaricewith%20egg.jpg'
WHERE name = 'Java Rice + Maling' AND stall_id = (SELECT id FROM stalls WHERE email = 'cocina@gmail.com');
