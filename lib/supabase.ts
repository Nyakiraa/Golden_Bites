import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Supabase configuration
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || 'https://whfqzoyjghpyzwtemvmz.supabase.co';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZnF6b3lqZ2hweXp3dGVtdm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzOTM1NjEsImV4cCI6MjA3OTk2OTU2MX0.L_cteAMuMXFPP239PdUQjhgcqpMjEKRRPYkgn5xkTmo';

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

