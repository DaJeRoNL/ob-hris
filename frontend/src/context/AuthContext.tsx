import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  currentClientId: string;
  setClientId: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentClientId, setCurrentClientId] = useState<string>('c1');

  useEffect(() => {
    // SECURITY PATCH: Only allow bypass in strict DEV mode
    const isDev = import.meta.env.DEV && sessionStorage.getItem('dev_bypass') === 'true';

    if (isDev) {
      console.warn("⚠️ DEV BYPASS ACTIVE - DO NOT SHIP TO PROD ⚠️");
      setSession({
        access_token: 'dev-token',
        refresh_token: 'dev-refresh',
        expires_in: 3600,
        token_type: 'bearer',
        user: { id: 'dev-user', aud: 'authenticated', role: 'authenticated', email: 'dev@local', app_metadata: {}, user_metadata: {}, created_at: '' }
      } as Session);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    sessionStorage.removeItem('dev_bypass');
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, loading, signOut, currentClientId, setClientId: setCurrentClientId }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
