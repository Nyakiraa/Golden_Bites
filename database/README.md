# Database Setup Instructions

## Setting up the Database Schema

1. **Go to your Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard/project/whfqzoyjghpyzwtemvmz
   - Go to the SQL Editor

2. **Run the Schema SQL**
   - Open `database/schema.sql` in this project
   - Copy the entire contents
   - Paste it into the Supabase SQL Editor
   - Click "Run" to execute the SQL

This will create:
- `users` table for user profiles (automatically populated when users sign up)
- `admins` table to link users to stalls (for admin access)
- `stalls` table with all necessary columns
- `foods` table for menu items linked to stalls
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers for automatic timestamp updates and user profile creation
- Views for public data access

**Note**: The `users` table is automatically populated via a database trigger whenever a new user signs up through Supabase Auth. The trigger extracts the user's name from the signup metadata.

## Setting Up Admin Access

To give a user admin access to a stall (e.g., `rcfood@gmail.com` for RC FOOD STALL):

1. **Create the admin table** (if not already created):
   - Open `database/create-admin-table.sql` in this project
   - Copy the entire contents
   - Paste it into the Supabase SQL Editor
   - Click "Run" to execute the SQL

2. **Link the user to the stall**:
   - Open `database/link-rcfood-admin.sql` in this project
   - Update the email if needed (currently set to `rcfood@gmail.com`)
   - Copy the entire contents
   - Paste it into the Supabase SQL Editor
   - Click "Run" to execute the SQL

This will:
- Create an admin record linking the user to RC FOOD STALL
- Allow the user to access the admin dashboard when they log in
- The dashboard will automatically fetch foods for that stall

**Note**: The admin table allows multiple users to be admins of the same stall, and a user can be an admin of multiple stalls.

## Creating the RC FOOD STALL Account

### Option 1: Using the Script (Recommended)

1. **Make sure the database schema is set up first** (see above)

2. **Edit the script** (optional):
   - Open `scripts/create-stall-account.js`
   - Update the email and password if needed:
     ```javascript
     const rcFoodStall = {
       name: 'RC FOOD STALL',
       location: 'Bonoan Building, Ateneo de Naga University',
       email: 'rcfoodstall@goldenbites.com', // Change this
       password: '12345', // Change this
       phone: '+639123456789', // Optional
     };
     ```

3. **Run the script**:
   ```bash
   npm run create-stall
   ```

### Option 2: Manual Creation via Supabase Dashboard

1. **Create Auth User**:
   - Go to Authentication > Users in Supabase Dashboard
   - Click "Add User" > "Create new user"
   - Enter email and password
   - Add user metadata:
     ```json
     {
       "name": "RC FOOD STALL",
       "role": "stall_owner"
     }
     ```

2. **Create Stall Record**:
   - Go to Table Editor > `stalls`
   - Click "Insert" > "Insert row"
   - Fill in:
     - `name`: "RC FOOD STALL"
     - `location`: "Bonoan Building, Ateneo de Naga University"
     - `owner_id`: (the UUID from the user you just created)
     - `email`: (the email you used for the auth user)
   - Click "Save"

## Verifying the Account

After creating the account, you can verify it by:

1. **Check Auth Users**:
   - Go to Authentication > Users
   - You should see the new user

2. **Check Stalls Table**:
   - Go to Table Editor > `stalls`
   - You should see the RC FOOD STALL record

3. **Confirm Email** (if needed):
   - If you get an "email not confirmed" error when signing in, you need to confirm the email
   - **Option A - Using Script** (requires Service Role Key):
     ```bash
     # Set your service role key (get it from Supabase Dashboard > Settings > API)
     export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
     npm run confirm-email rcfoodstall@gmail.com
     ```
   - **Option B - Manual Confirmation**:
     - Go to Supabase Dashboard > Authentication > Users
     - Find the user by email
     - Click on the user
     - Click "Confirm Email" button or manually set `email_confirmed_at` to current timestamp
   - **Option C - Disable Email Confirmation** (for development):
     - Go to Supabase Dashboard > Authentication > Settings
     - Under "Email Auth", disable "Enable email confirmations"
     - This allows users to sign in without confirming their email

4. **Test Login**:
   - Use the email and password you set to test authentication in your app

## Adding Menu Items (Foods) to a Stall

After creating a stall, you can add menu items using the `foods` table:

1. **Using SQL Script**:
   - Open `database/insert-sample-foods.sql`
   - The script will automatically find RC FOOD STALL and insert sample items including bihon
   - Run it in Supabase SQL Editor

2. **Using Supabase Dashboard**:
   - Go to Table Editor > `foods`
   - Click "Insert" > "Insert row"
   - Fill in:
     - `stall_id`: (UUID of the stall)
     - `name`: Food item name (e.g., "Bihon")
     - `description`: Description of the food
     - `price`: Price in decimal (e.g., 45.00)
     - `image_url`: URL to food image (optional)
     - `category`: Category like "Main Course", "Breakfast", etc.
     - `is_available`: true/false
     - `display_order`: Order in menu (lower numbers appear first)

3. **Querying Foods for a Stall**:
   ```sql
   SELECT * FROM foods 
   WHERE stall_id = 'YOUR_STALL_UUID' 
   AND is_available = true
   ORDER BY display_order;
   ```

   Or use the view:
   ```sql
   SELECT * FROM public_foods 
   WHERE stall_id = 'YOUR_STALL_UUID'
   ORDER BY display_order;
   ```

## Database Schema Overview

### Users Table
- Stores user profile information
- Automatically created when a user signs up (via database trigger)
- Linked to `auth.users` via `id` (foreign key)
- Contains email, name, phone, avatar_url
- Automatically extracts name from signup metadata

### Admins Table
- Links users to stalls for admin access
- Allows multiple users to be admins of the same stall
- Allows a user to be an admin of multiple stalls
- Linked to `auth.users` via `user_id` and `stalls` via `stall_id`
- Used to determine if a user should be redirected to the admin dashboard

### Stalls Table
- Stores stall/restaurant information
- Linked to auth users via `owner_id`
- Contains rating, location, contact info

### Foods Table
- Stores menu items/food items
- Linked to stalls via `stall_id` (foreign key)
- Contains name, description, price, image, category
- Supports availability and display ordering

## Notes

- The script uses the anon key, which has limited permissions
- For production, consider using the service role key (keep it secure!)
- Make sure to change the default password before going to production
- The email should be unique and valid
- Foods are automatically linked to stalls via the `stall_id` foreign key
- When a stall is deleted, all its foods are automatically deleted (CASCADE)

