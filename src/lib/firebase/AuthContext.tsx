'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, getIdTokenResult } from 'firebase/auth';
import { auth } from './config';
import { UserRole, UserClaims } from './roles';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: UserRole | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  role: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const tokenResult = await getIdTokenResult(user);
          const claims = tokenResult.claims as UserClaims;
          const userRole = claims.role || null;
          setRole(userRole);
          
          // Create session cookie
          const idToken = await user.getIdToken();
          const response = await fetch('/api/auth/session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }),
          });

          if (response.ok) {
            const { sessionCookie } = await response.json();
            Cookies.set('session', sessionCookie, { 
              expires: 7, // Expires in 7 days
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax'
            });
          }

          if (userRole) {
            Cookies.set('role', userRole, { 
              expires: 7,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax'
            });
          }
        } catch (error) {
          console.error('Error getting user claims:', error);
          setRole(null);
          Cookies.remove('session');
          Cookies.remove('role');
        }
      } else {
        setRole(null);
        Cookies.remove('session');
        Cookies.remove('role');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, role }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 