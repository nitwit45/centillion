import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  fullName: string;
  email: string;
  age: string;
  phone: string;
  country: string;
  createdAt: string;
  isFirstLogin: boolean;
  profileCompleted: boolean;
  beautyFormSubmitted: boolean;
  beautyFormStatus: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (userData: RegisterData) => { success: boolean; tempPassword: string; error?: string };
  logout: () => void;
  updatePassword: (oldPassword: string, newPassword: string) => boolean;
  updateUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

export interface RegisterData {
  fullName: string;
  email: string;
  age: string;
  phone: string;
  country: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface StoredUser extends User {
  password: string;
}

const generateTempPassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const currentUserEmail = localStorage.getItem('currentUser');
    if (currentUserEmail) {
      const users: StoredUser[] = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find(u => u.email === currentUserEmail);
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
      }
    }
  }, []);

  const register = (userData: RegisterData): { success: boolean; tempPassword: string; error?: string } => {
    const users: StoredUser[] = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
      return { success: false, tempPassword: '', error: 'Email already registered' };
    }

    const tempPassword = generateTempPassword();
    const newUser: StoredUser = {
      id: generateUserId(),
      ...userData,
      password: tempPassword,
      createdAt: new Date().toISOString(),
      isFirstLogin: true,
      profileCompleted: false,
      beautyFormSubmitted: false,
      beautyFormStatus: 'draft',
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    return { success: true, tempPassword };
  };

  const login = (email: string, password: string): boolean => {
    const users: StoredUser[] = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      localStorage.setItem('currentUser', email);
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  const updatePassword = (oldPassword: string, newPassword: string): boolean => {
    if (!user) return false;

    const users: StoredUser[] = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === user.email);
    
    if (userIndex === -1 || users[userIndex].password !== oldPassword) {
      return false;
    }

    users[userIndex].password = newPassword;
    users[userIndex].isFirstLogin = false;
    localStorage.setItem('users', JSON.stringify(users));
    
    setUser({ ...user, isFirstLogin: false });
    return true;
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);

    const users: StoredUser[] = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === user.email);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updatePassword,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

