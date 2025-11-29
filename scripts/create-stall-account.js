/**
 * Script to create a stall account in Supabase
 * Run this script to create the RC FOOD STALL account
 * 
 * Usage: node scripts/create-stall-account.js
 * 
 * Note: Make sure you have the @supabase/supabase-js package installed
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://whfqzoyjghpyzwtemvmz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZnF6b3lqZ2hweXp3dGVtdm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzOTM1NjEsImV4cCI6MjA3OTk2OTU2MX0.L_cteAMuMXFPP239PdUQjhgcqpMjEKRRPYkgn5xkTmo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createStallAccount(stallData) {
  try {
    console.log('Creating stall account for:', stallData.name);
    console.log('Email:', stallData.email);
    console.log('');
    
    // Step 1: Try to sign in first (in case user already exists)
    console.log('Step 1: Checking for existing user...');
    let authData = { user: null, session: null };
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: stallData.email,
      password: stallData.password,
    });

    if (signInError) {
      // User doesn't exist or wrong password, try to create
      console.log('  No existing user found. Creating new user...');
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: stallData.email,
        password: stallData.password,
        options: {
          data: {
            name: stallData.name,
            role: 'stall_owner',
          },
          emailRedirectTo: undefined,
        },
      });

      if (signUpError) {
        console.error('❌ Error creating auth user:', signUpError.message);
        console.error('   Code:', signUpError.code);
        throw signUpError;
      }

      if (!signUpData.user) {
        throw new Error('Failed to create user - no user data returned');
      }

      authData = signUpData;
      console.log('✓ Auth user created:', authData.user.id);
      if (authData.session) {
        console.log('  Note: User may need email confirmation depending on your Supabase settings.');
      }
    } else {
      // User exists, use existing
      authData = signInData;
      console.log('✓ Using existing user:', authData.user.id);
    }

    // If we don't have a session, try to sign in to get one
    let session = authData.session;
    let supabaseClient = supabase;
    
    if (!session) {
      console.log('  No session found. Attempting to sign in...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: stallData.email,
        password: stallData.password,
      });
      
      if (signInError) {
        console.warn('  ⚠️  Could not sign in automatically:', signInError.message);
        console.warn('  This might be due to email confirmation requirements.');
        console.warn('  You may need to confirm the email first, or manually create the stall record.');
        console.warn('  User ID for manual creation:', authData.user.id);
      } else {
        session = signInData.session;
        // Create a new client with the session token
        supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
          global: {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          },
        });
        console.log('  ✓ Signed in successfully');
      }
    } else {
      // Use the session from signUp
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      });
    }

    // Step 2: Create stall record in database
    console.log('Step 2: Creating stall record in database...');
    const { data: stallRecord, error: stallError } = await supabaseClient
      .from('stalls')
      .insert([
        {
          name: stallData.name,
          location: stallData.location,
          owner_id: authData.user.id,
          email: stallData.email,
          phone: stallData.phone || null,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (stallError) {
      console.error('❌ Error creating stall record:', stallError.message);
      console.error('   Details:', stallError);
      
      // Check if it's a table doesn't exist error
      if (stallError.message.includes('relation') && stallError.message.includes('does not exist')) {
        console.error('\n⚠️  The "stalls" table does not exist!');
        console.error('   Please run the SQL schema first:');
        console.error('   1. Go to Supabase Dashboard > SQL Editor');
        console.error('   2. Copy and run the contents of database/schema.sql');
        console.error('   3. Then run this script again');
      } else if (stallError.code === '23505') { // Unique violation
        console.error('\n⚠️  A stall with this email already exists!');
        console.error('   The account may have been partially created.');
      }
      
      console.warn('\n⚠️  Warning: Auth user was created but stall record failed.');
      console.warn('   You may need to manually create the stall record or delete the auth user.');
      throw stallError;
    }

    console.log('✓ Stall record created:', stallRecord);
    console.log('\n✅ Successfully created stall account!');
    console.log('\nAccount Details:');
    console.log('  Name:', stallData.name);
    console.log('  Email:', stallData.email);
    console.log('  Location:', stallData.location);
    console.log('  User ID:', authData.user.id);
    console.log('  Stall ID:', stallRecord.id);

    return {
      user: authData.user,
      stall: stallRecord,
    };
  } catch (error) {
    console.error('Failed to create stall account:', error);
    throw error;
  }
}

// RC FOOD STALL data
// Note: Supabase requires a valid email domain. Use a real email address.
const rcFoodStall = {
  name: 'RC FOOD STALL',
  location: 'Bonoan Building, Ateneo de Naga University',
  email: 'rcfoodstall@gmail.com', // Change this to a valid email address
  password: 'RCFoodStall2024!', // Change this to a secure password
  phone: '+639123456789', // Optional: Add actual phone number
};

// Run the script
createStallAccount(rcFoodStall)
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

