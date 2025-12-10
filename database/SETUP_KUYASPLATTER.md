# Kuya's Platter Store Setup Guide

This guide explains how to set up the "Kuya's Platter" store in the Golden Bites application.

## Account Details
- **Store Name**: Kuya's Platter
- **Email**: kplatter@gmail.com
- **Password**: 123456
- **Location**: Bonoan Building, Ateneo de Naga University

## Setup Steps

### Step 1: Create the Auth User (via Supabase Dashboard)
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User"
3. Enter the following details:
   - **Email**: kplatter@gmail.com
   - **Password**: 123456
   - **Auto Confirm User**: Toggle ON (to skip email verification)
4. Click "Create User"

### Step 2: Create the Stall Record
Run the following SQL in your Supabase SQL Editor:

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

### Step 3: Link Admin to Stall
After creating the auth user and stall, run this SQL to link them:

```sql
INSERT INTO admins (user_id, stall_id)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'kplatter@gmail.com' LIMIT 1),
  (SELECT id FROM stalls WHERE email = 'kplatter@gmail.com' LIMIT 1)
WHERE EXISTS (SELECT 1 FROM auth.users WHERE email = 'kplatter@gmail.com')
  AND EXISTS (SELECT 1 FROM stalls WHERE email = 'kplatter@gmail.com');
```

### Step 4: Insert Menu Items
Run the SQL file `insert-kuyasplatter-foods.sql` to add all menu items.

## Menu Items (35 items total)

### Beverages (7 items)
- Iced Tea (10oz) - ₱20
- Iced Tea (12oz) - ₱25
- Iced Tea (16oz) - ₱30
- Blue Lemonade (10oz) - ₱20
- Blue Lemonade (12oz) - ₱25
- Blue Lemonade (16oz) - ₱30
- Buko Juice - ₱35

### Food (28 items)
- Pancit - ₱35
- Bihon - ₱35
- Palabok - ₱35
- Sandwich - ₱25
- Hotdog (Large) - ₱20
- Hotdog (Medium) - ₱15
- Boiled Egg - ₱15
- Lumpia (3pcs) - ₱25
- Fish Okoy - ₱35
- Fried Chicken - ₱50
- Turon - ₱25
- Banana Que - ₱25
- Camote Que - ₱25
- Hegado - ₱55
- Bopis - ₱55
- Dinuguan - ₱55
- Ginataang Gulay - ₱30
- Vegetable Guisado - ₱25
- Kare-Kare - ₱65
- Kaldereta - ₱65
- Giniling - ₱55
- Curry - ₱55
- Steak - ₱55
- Adobo - ₱55

## Testing the Setup

1. **Sign In**: Use the credentials:
   - Email: kplatter@gmail.com
   - Password: 123456

2. **Verify**: After signing in, you should see:
   - Store name: "Kuya's Platter"
   - 35 menu items in the dashboard
   - All items organized by category (Beverages and Food)

## Troubleshooting

- **User not found**: Make sure the auth user was created with auto-confirm enabled
- **Stall not linked**: Verify the admin record was created with correct user_id and stall_id
- **Menu items not showing**: Ensure the stall exists before inserting foods
