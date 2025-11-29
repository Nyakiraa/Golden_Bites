import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Check authentication status and redirect accordingly
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Check if user is an admin (has a record in admins table)
        supabase
          .from('admins')
          .select('stall_id')
          .eq('user_id', session.user.id)
          .maybeSingle()
          .then(({ data, error }) => {
            if (data && !error) {
              // User is an admin, redirect to admin dashboard
              router.replace('/admin/stall-dashboard');
            } else {
              // Regular user, redirect to tabs
              router.replace('/(tabs)');
            }
          });
      } else {
        // Not authenticated, redirect to welcome
        router.replace('/welcome');
      }
    });
  }, []);

  return null; // This component doesn't render anything
}

