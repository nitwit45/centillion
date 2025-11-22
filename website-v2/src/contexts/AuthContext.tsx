import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export interface User {
  id: string;
  fullName: string;
  email: string;
  age: string;
  phone: string;
  country: string;
  createdAt: string;
  isFirstLogin: boolean;
  passwordSet: boolean;
  profileCompleted: boolean;
  beautyFormSubmitted: boolean;
  beautyFormStatus: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, onSuccess?: (user: User) => void) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  refreshAuth: () => Promise<void>;
  refreshUser: () => Promise<void>;
  // Treatment form functions
  getTreatmentForm: () => Promise<{ success: boolean; data?: TreatmentFormData; error?: string }>;
  saveTreatmentForm: (formData: Partial<TreatmentFormData>) => Promise<{ success: boolean; error?: string }>;
  submitTreatmentForm: () => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface RegisterData {
  fullName: string;
  email: string;
  age: string;
  phone: string;
  country: string;
}

export interface TreatmentFormData {
  // Personal Info
  dateOfBirth: string;
  gender: string;
  occupation: string;

  // Purpose of Visit
  purposeOfVisit: string[];

  // Surgical Treatments
  facialSurgeries: string[];
  bodyContouring: string[];
  breastChest: string[];
  buttocksHips: string[];

  // Non-Surgical Treatments
  facialSkin: string[];
  bodyShape: string[];
  hairAntiAging: string[];

  // Transgender Treatments
  transgenderTreatments: string[];

  // Additional Information
  previousProcedures: boolean;
  previousProceduresDetails: string;
  medicalConditions: string;
  preferredMonth: string;
  includeSightseeing: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in by checking for stored token
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token with backend
      fetchUserFromToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserFromToken = async (token: string) => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoading(true);
      await fetchUserFromToken(token);
    }
  };

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      await fetchUserFromToken(token);
    }
  }, []);

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const login = async (email: string, password: string, onSuccess?: (user: User) => void): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
    
      if (data.success) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        // Call the success callback with user data for redirection logic
        if (onSuccess) {
          onSuccess(data.user);
        }
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const updatePassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'Not authenticated' };
      }

      const response = await fetch('http://localhost:5001/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();

      if (data.success && user) {
    setUser({ ...user, isFirstLogin: false });
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Update password error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Not authenticated');
        return;
      }

      const response = await fetch('http://localhost:5001/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state with the response data
        setUser(data.user);
      } else {
        console.error('Failed to update profile:', data.error);
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const getTreatmentForm = async (): Promise<{ success: boolean; data?: TreatmentFormData; error?: string }> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'Not authenticated' };
      }

      const response = await fetch('http://localhost:5001/api/treatment-form', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, data: data.treatmentForm };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Get treatment form error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const saveTreatmentForm = async (formData: Partial<TreatmentFormData>): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'Not authenticated' };
      }

      const response = await fetch('http://localhost:5001/api/treatment-form', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Save treatment form error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const submitTreatmentForm = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'Not authenticated' };
      }

      const response = await fetch('http://localhost:5001/api/treatment-form/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        // Refresh user data from backend to get updated status
        await fetchUserFromToken(token);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Submit treatment form error:', error);
      return { success: false, error: 'Network error. Please try again.' };
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
        refreshAuth,
        refreshUser,
        getTreatmentForm,
        saveTreatmentForm,
        submitTreatmentForm,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};



