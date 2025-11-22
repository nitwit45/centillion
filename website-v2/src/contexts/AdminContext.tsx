import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';

export interface AdminStats {
  users: {
    total: number;
    verified: number;
    withForms: number;
    recent: number;
  };
  forms: {
    total: number;
    submitted: number;
    underReview: number;
    approved: number;
    rejected: number;
    recent: number;
  };
}

export interface AdminUser {
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
  isVerified: boolean;
}

export interface AdminForm {
  _id: string;
  userId: string;
  user: {
    fullName: string;
    email: string;
    phone: string;
    country: string;
  };
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  submittedAt?: Date;
  lastModifiedAt: Date;
  createdAt: Date;
  // Form data fields would be here
  dateOfBirth?: string;
  gender?: string;
  purposeOfVisit?: string[];
}

interface AdminContextType {
  stats: AdminStats | null;
  users: AdminUser[];
  forms: AdminForm[];
  loading: boolean;
  error: string | null;

  // Methods
  fetchStats: () => Promise<void>;
  fetchUsers: (page?: number, limit?: number, filters?: any) => Promise<void>;
  fetchForms: (page?: number, limit?: number, filters?: any) => Promise<void>;
  updateFormStatus: (formId: string, status: string, notes?: string) => Promise<boolean>;
  updateUserRole: (userId: string, role: 'user' | 'admin') => Promise<boolean>;
  getUserDetails: (userId: string) => Promise<{ user: AdminUser; form: AdminForm | null } | null>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [forms, setForms] = useState<AdminForm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if current user is admin
  const isAdmin = user?.role === 'admin';

  const makeAdminRequest = async (endpoint: string, options?: RequestInit) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`http://localhost:5001/api/admin${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Request failed');
    }

    return data.data;
  };

  const fetchStats = useCallback(async () => {
    if (!isAdmin) return;

    try {
      setLoading(true);
      setError(null);
      const data = await makeAdminRequest('/dashboard/stats');
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchUsers = useCallback(async (page = 1, limit = 10, filters = {}) => {
    if (!isAdmin) return;

    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      });

      const data = await makeAdminRequest(`/users?${queryParams}`);
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchForms = useCallback(async (page = 1, limit = 10, filters = {}) => {
    if (!isAdmin) return;

    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      });

      const data = await makeAdminRequest(`/forms?${queryParams}`);
      setForms(data.forms);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch forms');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const updateFormStatus = useCallback(async (formId: string, status: string, notes?: string): Promise<boolean> => {
    if (!isAdmin) return false;

    try {
      setError(null);
      await makeAdminRequest(`/forms/${formId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, notes }),
      });

      // Refresh forms after update
      await fetchForms();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update form status');
      return false;
    }
  }, [isAdmin, fetchForms]);

  const updateUserRole = useCallback(async (userId: string, role: 'user' | 'admin'): Promise<boolean> => {
    if (!isAdmin) return false;

    try {
      setError(null);
      await makeAdminRequest(`/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      });

      // Refresh users after update
      await fetchUsers();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user role');
      return false;
    }
  }, [isAdmin, fetchUsers]);

  const getUserDetails = useCallback(async (userId: string): Promise<{ user: AdminUser; form: AdminForm | null } | null> => {
    if (!isAdmin) return null;

    try {
      setError(null);
      const data = await makeAdminRequest(`/users/${userId}`);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user details');
      return null;
    }
  }, [isAdmin]);

  // Auto-fetch stats when admin logs in
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchStats();
    }
  }, [isAuthenticated, isAdmin, fetchStats]);

  const value: AdminContextType = {
    stats,
    users,
    forms,
    loading,
    error,
    fetchStats,
    fetchUsers,
    fetchForms,
    updateFormStatus,
    updateUserRole,
    getUserDetails,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
