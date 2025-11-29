/**
 * Script to create a stall account in Supabase
 * Run this script to create the RC FOOD STALL account
 * 
 * Usage: npx tsx scripts/create-stall-account.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://whfqzoyjghpyzwtemvmz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZnF6b3lqZ2hweXp3dGVtdm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzOTM1NjEsImV4cCI6MjA3OTk2OTU2MX0.L_cteAMuMXFPP239PdUQjhgcqpMjEKRRPYkgn5xkTmo';

// Note: For creating users, you'll need the service role key in production
// For now, this script assumes you'll run the SQL directly or use the Supabase dashboard
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface StallData {
  name: string;
  location: string;
  email: string;
  password: string;
  phone?: string;
}

async function createStallAccount(stallData: StallData) {
  try {
    console.log('Creating stall account for:', stallData.name);
    
    // Step 1: Create auth user
    console.log('Step 1: Creating authentication user...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: stallData.email,
      password: stallData.password,
      options: {
        data: {
          name: stallData.name,
          role: 'stall_owner',
        },
      },
    });

    if (authError) {
      console.error('Error creating auth user:', authError.message);
      throw authError;
    }

    if (!authData.user) {
      throw new Error('Failed to create user');
    }

    console.log('✓ Auth user created:', authData.user.id);

    // Step 2: Create stall record in database
    console.log('Step 2: Creating stall record in database...');
    const { data: stallRecord, error: stallError } = await supabase
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
      console.error('Error creating stall record:', stallError.message);
      // If stall creation fails, we should clean up the auth user
      // Note: This requires service role key, so we'll just log it
      console.warn('Warning: Auth user was created but stall record failed. You may need to manually delete the auth user.');
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
const rcFoodStall: StallData = {
  name: 'RC FOOD STALL',
  location: 'Bonoan Building, Ateneo de Naga University',
  email: 'rcfoodstall@goldenbites.com', // Change this to the actual email
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

