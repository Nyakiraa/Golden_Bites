# Fix "Email Not Confirmed" Error

If you're getting an "email not confirmed" error when trying to sign in, here are the quickest ways to fix it:

## Quick Fix Options (Choose One)

### Option 1: Disable Email Confirmation (Easiest for Development)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/whfqzoyjghpyzwtemvmz
2. Navigate to **Authentication** > **Settings**
3. Scroll down to **Email Auth** section
4. **Disable** "Enable email confirmations"
5. Save the changes

Now you can sign in without confirming your email!

### Option 2: Manually Confirm Email in Dashboard

1. Go to Supabase Dashboard > **Authentication** > **Users**
2. Find the user (e.g., `rcfoodstall@gmail.com`)
3. Click on the user to open their details
4. Look for the **"Confirm Email"** button and click it
   - OR manually set the `email_confirmed_at` field to the current timestamp

### Option 3: Use the Confirm Email Script

1. Get your Service Role Key:
   - Go to Supabase Dashboard > **Settings** > **API**
   - Copy the `service_role` key (keep it secret!)

2. Run the script:
   ```bash
   # Set the service role key as an environment variable
   export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
   
   # Confirm the email
   npm run confirm-email rcfoodstall@gmail.com
   ```

   Or on Windows PowerShell:
   ```powershell
   $env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
   npm run confirm-email rcfoodstall@gmail.com
   ```

## For Production

In production, you should:
- Keep email confirmation enabled for security
- Set up proper email templates
- Handle email confirmation flow in your app

## Current RC FOOD STALL Account

- **Email**: `rcfoodstall@gmail.com`
- **Password**: `12345`

After confirming the email using any of the methods above, you should be able to sign in successfully!

