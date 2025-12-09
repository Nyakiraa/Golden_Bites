# Kuya's Platter Store Setup Instructions

## Overview
This document provides step-by-step instructions to set up the "Kuya's Platter" store in the Golden Bites application.

## Account Information
- **Store Name**: Kuya's Platter
- **Email**: kplatter@gmail.com
- **Password**: 123456
- **Location**: Bonoan Building, Ateneo de Naga University

## Complete Setup Process

### Step 1: Create Authentication User in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Click the **"Add User"** button
4. Fill in the following details:
   - **Email**: `kplatter@gmail.com`
   - **Password**: `123456`
   - **Auto Confirm User**: Toggle **ON** (important - this skips email verification)
5. Click **"Create User"**

### Step 2: Create the Stall Record

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Create a new query and run the following SQL:

```sql
INSERT INTO stalls (name, location, email, phone, is_active)
VALUES (
  'Kuya''s Platter',
  'Bonoan Building, Ateneo de Naga University',
  'kplatter@gmail.com',
  NULL,
  true
)
ON CONFLICT (email) DO NOTHING;
```

4. Click **"Run"** to execute

### Step 3: Link Admin User to Stall

1. In the same SQL Editor, run this query:

```sql
INSERT INTO admins (user_id, stall_id)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'kplatter@gmail.com' LIMIT 1),
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1)
WHERE EXISTS (SELECT 1 FROM auth.users WHERE email = 'kplatter@gmail.com')
  AND EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com')
ON CONFLICT (user_id, stall_id) DO NOTHING;
```

2. Click **"Run"** to execute

### Step 4: Insert All Menu Items

1. In the SQL Editor, run the following SQL to insert all 35 menu items:

```sql
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
```

2. Click **"Run"** to execute all inserts

## Verification

After completing all steps, verify the setup:

1. **Test Sign In**:
   - Open the app
   - Go to Sign In
   - Enter:
     - Email: `kplatter@gmail.com`
     - Password: `123456`
   - Click Sign In

2. **Verify Store Data**:
   - You should see "Kuya's Platter" as the store name
   - The dashboard should display all 35 menu items
   - Items should be organized by category (Beverages and Food)

3. **Check Database** (Optional):
   - In Supabase SQL Editor, run:
   ```sql
   SELECT COUNT(*) as total_items FROM foods 
   WHERE stall_id = (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com');
   ```
   - Should return: `35`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid login credentials" | Verify the auth user was created with auto-confirm enabled |
| Store name not showing | Check that the stall record was inserted correctly |
| Menu items not visible | Ensure the admin user is linked to the stall |
| Only some items showing | Verify all INSERT statements were executed |

## Summary

You have successfully set up:
- ✅ Authentication user (kplatter@gmail.com)
- ✅ Stall record (Kuya's Platter)
- ✅ Admin link (user to stall)
- ✅ 35 menu items (7 beverages + 28 food items)

The store is now ready to accept orders!
