
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session ? 'Session active' : 'No session');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Set up automatic token refresh
        if (session) {
          setupTokenRefresh(session);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session ? 'Session found' : 'No session');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Set up automatic token refresh for existing session
      if (session) {
        setupTokenRefresh(session);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Function to set up automatic token refresh
  const setupTokenRefresh = (session: Session) => {
    if (!session.expires_at) return;

    const expiresAt = session.expires_at * 1000; // Convert to milliseconds
    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;
    
    // Refresh token 5 minutes before it expires
    const refreshTime = Math.max(timeUntilExpiry - (5 * 60 * 1000), 0);

    console.log(`Token will be refreshed in ${Math.round(refreshTime / 1000 / 60)} minutes`);

    // Clear any existing timeout
    if (window.tokenRefreshTimeout) {
      clearTimeout(window.tokenRefreshTimeout);
    }

    // Set up automatic refresh
    window.tokenRefreshTimeout = setTimeout(async () => {
      console.log('Attempting to refresh token...');
      try {
        const { data, error } = await supabase.auth.refreshSession();
        if (error) {
          console.error('Token refresh failed:', error);
        } else {
          console.log('Token refreshed successfully');
          // The onAuthStateChange listener will handle updating the state
        }
      } catch (error) {
        console.error('Token refresh error:', error);
      }
    }, refreshTime);
  };

  return { user, session, loading };
};

// Extend window interface for TypeScript
declare global {
  interface Window {
    tokenRefreshTimeout?: NodeJS.Timeout;
  }
}
