-- Update Noodle House menu items with image URLs from storage
-- Images are stored in: menu-images/noodle_house/ folder in Supabase storage

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/friedNoodles.png'
WHERE name = 'Fried Noodles' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/sharksfinsional.png'
WHERE name = 'Sharksfin Siomai' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/porkSiomai.png'
WHERE name = 'Pork Siomai' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/beefSiomai.png'
WHERE name = 'Beef Siomai' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/wantonSiomai.png'
WHERE name = 'Wanton Siomai' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/beefTeriyaki.png'
WHERE name = 'Beef Teriyaki' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/friedricewithsiomai.png'
WHERE name = 'Fried Rice w/ Siomai' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/friedricewithbeefteriyaki.png'
WHERE name = 'Fried Rice w/ Beef Teriyaki' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/plainricewithsiomai.png'
WHERE name = 'Plain Rice w/ Siomai' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/plainricewithbeefteriyaki.png'
WHERE name = 'Plain Rice w/ Beef Teriyaki' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/tapsilog.jpg'
WHERE name = 'Tapsilog' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/hotsilog.jpg'
WHERE name = 'Hotsilog' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/longsilog.jpg'
WHERE name = 'Longsilog' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/hamsilog.jpg'
WHERE name = 'Hamsilog' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/friedricewithsiomai.png'
WHERE name = 'Fried Rice w/ Siomai + Black Gulaman Combo' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/friedricewithbeefteriyaki.png'
WHERE name = 'Fried Rice w/ Beef Teriyaki + Black Gulaman Combo' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/plainricewithsiomai.png'
WHERE name = 'Plain Rice w/ Siomai + Black Gulaman Combo' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/plainricewithbeefteriyaki.png'
WHERE name = 'Plain Rice w/ Beef Teriyaki + Black Gulaman Combo' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/beefSiomai.png'
WHERE name = 'Beef Siomai 5pcs' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/porkSiomai.png'
WHERE name = 'Pork Siomai 5pcs' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/chickenSiomai.png'
WHERE name = 'Chicken Siomai 5pcs' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/japanesesiomai.png'
WHERE name = 'Japanese Siomai 5pcs' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/adobobolabol.png'
WHERE name = 'Adobo / BolaBola' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/asadosiopao.png'
WHERE name = 'Asado Siopao' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/cookiesandcreamgrahambar.png'
WHERE name = 'Graham Bars - Cookies and Cream' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/mangoflavorgrahambar.png'
WHERE name = 'Graham Bars - Mango Flavor' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/matchaoreograhambar.png'
WHERE name = 'Graham Bars - Matcha Oreo' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/chocmallowsgrahambar.png'
WHERE name = 'Graham Bars - Choco Mallows' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/strawberrygrahambar.png'
WHERE name = 'Graham Bars - Strawberry' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');

UPDATE foods
SET image_url = 'https://whfqzoyjghpyzwtemvmz.supabase.co/storage/v1/object/public/menu-images/noodle_house/ubemallowsgrahambar.png'
WHERE name = 'Graham Bars - Ube Mallows' AND stall_id = (SELECT id FROM stalls WHERE email = 'noodles@gmail.com');
