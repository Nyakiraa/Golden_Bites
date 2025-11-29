import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isStallOwner, setIsStallOwner] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session) {
        checkStallOwner(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        await checkStallOwner(session.user.id);
      } else {
        setIsStallOwner(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkStallOwner = async (userId: string) => {
    try {
      // Check if user is an admin (has a record in admins table)
      const { data, error } = await supabase
        .from('admins')
        .select('stall_id')
        .eq('user_id', userId)
        .maybeSingle();

      setIsStallOwner(!!data && !error);
    } catch (error) {
      setIsStallOwner(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated === null) return; // Still loading

    const currentRoute = segments[0];
    const isOnWelcome = currentRoute === 'welcome';
    const isOnSignIn = currentRoute === 'signin';
    const isOnSignUp = currentRoute === 'signup';
    const isOnAdmin = currentRoute === 'admin';
    const isOnTabs = currentRoute === '(tabs)';

    if (!isAuthenticated) {
      // Not authenticated - allow access to welcome, signin, signup only
      if (!isOnWelcome && !isOnSignIn && !isOnSignUp) {
        router.replace('/welcome');
      }
    } else {
      // Authenticated - redirect based on user type
      if (isStallOwner) {
        // Stall owner should go to admin dashboard
        if (!isOnAdmin) {
          router.replace('/admin/stall-dashboard');
        }
      } else {
        // Regular user should go to tabs
        if (!isOnTabs && !isOnSignIn && !isOnSignUp && !isOnWelcome) {
          router.replace('/(tabs)');
        }
      }
    }
  }, [isAuthenticated, isStallOwner, segments]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="signin" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="admin/stall-dashboard" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
