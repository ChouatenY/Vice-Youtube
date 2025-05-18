'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_USER } from './local-user';

// Define the user type
type LocalUser = {
  id: string;
  email: string;
  name: string;
};

// Create the context
type LocalUserContextType = {
  user: LocalUser | null;
  isLoading: boolean;
};

const LocalUserContext = createContext<LocalUserContextType>({
  user: null,
  isLoading: true,
});

// Create a provider component
export function LocalUserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize the local user
    const initUser = async () => {
      try {
        // Check if we have a user ID in local storage
        if (typeof window !== 'undefined') {
          // Generate a persistent user ID if it doesn't exist
          if (!localStorage.getItem('localUserId')) {
            // Generate a unique ID that will persist across sessions
            const uniqueId = 'user-' + Math.random().toString(36).substring(2, 15) +
                             Math.random().toString(36).substring(2, 15);
            localStorage.setItem('localUserId', uniqueId);
            console.log('Created new persistent user ID:', uniqueId);
          }

          const storedUserId = localStorage.getItem('localUserId');
          console.log('Using stored user ID from localStorage:', storedUserId);

          // Use the default user with the ID from local storage
          const localUser = {
            ...DEFAULT_USER,
            id: storedUserId || DEFAULT_USER.id
          };

          setUser(localUser);
          console.log('Local user initialized with ID:', localUser.id);
        } else {
          // Fallback for server-side rendering
          setUser(DEFAULT_USER);
          console.log('Server-side rendering, using default user');
        }
      } catch (error) {
        console.error('Error initializing local user:', error);
        // Fallback to default user on error
        setUser(DEFAULT_USER);
      } finally {
        setIsLoading(false);
      }
    };

    initUser();
  }, []);

  return (
    <LocalUserContext.Provider value={{ user, isLoading }}>
      {children}
    </LocalUserContext.Provider>
  );
}

// Create a hook to use the context
export function useLocalUser() {
  return useContext(LocalUserContext);
}
