/**
 * Script to confirm a user's email in Supabase
 * This requires the Supabase Service Role Key (admin key)
 * 
 * Usage: node scripts/confirm-email.js <email>
 * 
 * Note: You need to set the SUPABASE_SERVICE_ROLE_KEY environment variable
 * or update the script with your service role key.
 * 
 * WARNING: Never commit the service role key to version control!
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://whfqzoyjghpyzwtemvmz.supabase.co';
// Get service role key from environment variable or update this line
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY_HERE';

if (supabaseServiceRoleKey === 'YOUR_SERVICE_ROLE_KEY_HERE') {
  console.error('❌ Error: Service Role Key not set!');
  console.error('   Please set the SUPABASE_SERVICE_ROLE_KEY environment variable:');
  console.error('   export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"');
  console.error('   Or update the script with your service role key.');
  console.error('\n   You can find your service role key in:');
  console.error('   Supabase Dashboard > Settings > API > service_role key');
  process.exit(1);
}

// Create admin client with service role key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function confirmEmail(email) {
  try {
    console.log(`Confirming email for: ${email}`);
    
    // First, get the user by email
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Error listing users:', listError.message);
      throw listError;
    }

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      console.error(`❌ User with email ${email} not found`);
      process.exit(1);
    }

    console.log(`✓ Found user: ${user.id}`);
    console.log(`  Email confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);

    if (user.email_confirmed_at) {
      console.log('✓ Email is already confirmed');
      return;
    }

    // Update user to confirm email
    const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        email_confirm: true
      }
    );

    if (updateError) {
      console.error('❌ Error confirming email:', updateError.message);
      throw updateError;
    }

    console.log('✅ Email confirmed successfully!');
    console.log(`   User ID: ${updatedUser.user.id}`);
    console.log(`   Email: ${updatedUser.user.email}`);
    console.log(`   Confirmed at: ${updatedUser.user.email_confirmed_at || 'Now'}`);

  } catch (error) {
    console.error('Failed to confirm email:', error);
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('❌ Error: Email address required');
  console.error('   Usage: node scripts/confirm-email.js <email>');
  console.error('   Example: node scripts/confirm-email.js rcfoodstall@gmail.com');
  process.exit(1);
}

// Run the script
confirmEmail(email)
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

