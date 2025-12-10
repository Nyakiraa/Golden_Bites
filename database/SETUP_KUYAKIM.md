# Kuya Kim Cuisine Setup Guide

This guide walks you through setting up Kuya Kim Cuisine as a new stall in the Golden Bites system.

## Prerequisites

- Node.js installed
- Supabase project set up
- Access to Supabase SQL Editor

## Setup Steps

### Step 1: Create the Auth User and User Profile

Run the following command to create the authentication user and user profile for Kuya Kim Cuisine:

```bash
node scripts/create-kuyakim-account.js
```

This will:
- Create a new auth user with email: `kkcuisine@gmail.com`
- Create a user profile in the `users` table
- Create the stall record in the database
- Output the User ID and Stall ID

**Note:** Save the User ID and Stall ID for reference.

### Step 2: Insert the Stall Record (If Manual Setup Required)

If the script fails or you need to manually set up, go to Supabase SQL Editor and run:

```sql
-- From: database/insert-kuyakim-stall.sql
```

This will:
- Create the user profile in the `users` table (if not already created)
- Create the stall record in the `stalls` table

### Step 3: Insert Menu Items

In Supabase SQL Editor, run:

```sql
-- From: database/insert-kuyakim-foods.sql
```

This will insert all 24 menu items for Kuya Kim Cuisine.

### Step 4: Link Admin User to Stall

In Supabase SQL Editor, run:

```sql
-- From: database/link-kuyakim-admin.sql
```

This links the auth user to the stall in the `admins` table so they can manage their menu.

## Stall Information

- **Name:** Kuya Kim Cuisine
- **Email:** kkcuisine@gmail.com
- **Password:** 123456 (from your request)
- **Location:** Bonoan Building, Ateneo de Naga University
- **Menu Items:** 24 items (2 Snacks, 5 Noodles, 17 Main Dishes)

## Verification

After setup, verify the stall was created correctly:

1. Go to Supabase Dashboard
2. Check the `users` table - should see "Kuya Kim Cuisine" with email `kkcuisine@gmail.com`
3. Check the `stalls` table - should see "Kuya Kim Cuisine" with owner_id linked to the user
4. Check the `foods` table - should see 24 items with stall_id matching Kuya Kim Cuisine
5. Check the `admins` table - should see the user linked to the stall

## Troubleshooting

- If the auth user creation fails, check your Supabase email settings
- If the stall record fails, ensure the email is unique
- If menu items don't insert, verify the stall exists first
