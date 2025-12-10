# Bam-Bam's Setup Guide

This guide walks you through setting up Bam-Bam's as a new stall in the Golden Bites system.

## Prerequisites

- Node.js installed
- Supabase project set up
- Access to Supabase SQL Editor

## Setup Steps

### Step 1: Create the Auth User and User Profile

The user account has already been created:
- **Email:** bambams@gmail.com
- **User ID:** 2a3de378-2637-48ae-af05-594e86281d4b

Now run the SQL files in Supabase SQL Editor in order:

### Step 2: Insert the Stall Record

Go to Supabase SQL Editor and run:

```sql
-- From: database/insert-bambam-stall.sql
```

This will:
- Create the user profile in the `users` table (if not already created)
- Create the stall record in the `stalls` table

### Step 3: Link Admin User to Stall

In Supabase SQL Editor, run:

```sql
-- From: database/link-bambam-admin.sql
```

This links the auth user to the stall in the `admins` table so they can manage their menu.

### Step 4: Add Menu Items (Optional)

Once the stall is created, you can add menu items through the admin dashboard or create a SQL file similar to `insert-bambam-foods.sql`.

## Stall Information

- **Name:** Bam-Bam's
- **Email:** bambams@gmail.com
- **User ID:** 2a3de378-2637-48ae-af05-594e86281d4b
- **Location:** Bonoan Building, Ateneo de Naga University

## Verification

After setup, verify the stall was created correctly:

1. Go to Supabase Dashboard
2. Check the `users` table - should see "Bam" with email `bambams@gmail.com`
3. Check the `stalls` table - should see "Bam-Bam's" with owner_id linked to the user
4. Check the `admins` table - should see the user linked to the stall

## Troubleshooting

- If the stall record fails, ensure the email is unique
- If the admin link fails, verify both the user and stall exist first
