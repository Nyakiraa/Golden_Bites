# Fix "Email Signups Are Disabled" Error

If you're getting an error that "email signups are disabled" when trying to sign up, you need to enable email signups in your Supabase project settings.

## Quick Fix: Enable Email Signups

1. **Go to your Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard/project/whfqzoyjghpyzwtemvmz

2. **Navigate to Authentication Settings**
   - Click on **Authentication** in the left sidebar
   - Click on **Settings** (or go directly to: Authentication > Settings)

3. **Enable Email Auth**
   - Scroll down to the **Email Auth** section
   - Make sure **"Enable Email Signup"** is **ENABLED** (toggle should be ON/green)
   - If it's disabled, click the toggle to enable it

4. **Save the changes**
   - The changes are saved automatically

5. **Test Sign Up**
   - Try signing up again in your app
   - It should work now!

## Additional Settings (Optional)

While you're in the Authentication settings, you might also want to:

- **Disable Email Confirmation** (for development):
  - Under "Email Auth", disable "Enable email confirmations"
  - This allows users to sign in immediately without confirming their email

- **Configure Email Templates** (for production):
  - Go to Authentication > Email Templates
  - Customize the confirmation and password reset emails

## For Development

For development purposes, it's recommended to:
- ✅ Enable Email Signup
- ❌ Disable Email Confirmations (so you can test immediately)
- ✅ Keep other security settings as default

## Troubleshooting

If you still can't sign up after enabling email signups:

1. **Check if the user already exists**
   - Go to Authentication > Users
   - If the email already exists, you'll need to delete it first or use a different email

2. **Check RLS (Row Level Security) policies**
   - Make sure your database tables have the correct policies
   - Run the schema.sql if you haven't already

3. **Check API keys**
   - Make sure you're using the correct anon key in your app
   - Check `lib/supabase.ts` to verify the key is correct

## Current Configuration

- **Project URL**: https://whfqzoyjghpyzwtemvmz.supabase.co
- **Email Signups**: Should be ENABLED
- **Email Confirmations**: Can be DISABLED for development

After enabling email signups, you should be able to create new accounts successfully!

