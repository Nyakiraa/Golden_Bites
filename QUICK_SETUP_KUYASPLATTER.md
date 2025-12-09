# Quick Setup: Kuya's Platter Store

## Account Credentials
- **Email**: kplatter@gmail.com
- **Password**: 123456

## Setup in 3 Steps

### Step 1: Create Auth User in Supabase Dashboard
1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add User"**
3. Enter:
   - Email: `kplatter@gmail.com`
   - Password: `123456`
   - **Auto Confirm User**: Toggle **ON** ✓
4. Click **"Create User"**

### Step 2: Run SQL Scripts in Order
Go to **SQL Editor** and run these scripts in sequence:

**Script 1**: Create the stall
```bash
database/insert-kuyasplatter-stall.sql
```

**Script 2**: Create user profile
```bash
database/create-kuyasplatter-user.sql
```

**Script 3**: Link admin to stall
```bash
database/link-kuyasplatter-admin.sql
```

**Script 4**: Insert all menu items
```bash
database/insert-kuyasplatter-foods.sql
```

### Step 3: Test the Setup
1. Open the app
2. Go to **Sign In**
3. Enter:
   - Email: `kplatter@gmail.com`
   - Password: `123456`
4. You should see the Kuya's Platter dashboard with 35 menu items

## What Gets Created
- ✅ Auth user (kplatter@gmail.com)
- ✅ User profile
- ✅ Stall record (Kuya's Platter)
- ✅ Admin link
- ✅ 35 menu items (7 beverages + 28 food items)

## Menu Summary
- **Beverages**: Iced Tea (3 sizes), Blue Lemonade (3 sizes), Buko Juice
- **Food**: 28 items including Pancit, Bihon, Palabok, Fried Chicken, Kare-Kare, Adobo, etc.

Done! The store is ready to accept orders.
