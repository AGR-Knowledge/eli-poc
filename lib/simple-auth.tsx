'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// User roles for role-based access control
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  STUDY_MANAGER = 'STUDY_MANAGER',
  DATA_MANAGER = 'DATA_MANAGER',
  CLINICAL_RESEARCHER = 'CLINICAL_RESEARCHER',
  PRINCIPAL_INVESTIGATOR = 'PRINCIPAL_INVESTIGATOR',
  SITE_COORDINATOR = 'SITE_COORDINATOR',
  MONITOR = 'MONITOR',
  VIEWER = 'VIEWER'
}

// User status
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_APPROVAL = 'PENDING_APPROVAL'
}

// Simplified user interface
interface SimpleUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  organization: {
    name: string;
    type: 'SPONSOR' | 'CRO' | 'SITE' | 'LABORATORY' | 'REGULATORY';
    id: string;
  };
  permissions: string[];
  assignedStudies: string[];
  assignedSites: string[];
}

interface AuthContextType {
  user: SimpleUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isApproved: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  hasStudyAccess: (studyId: string) => boolean;
  hasSiteAccess: (siteId: string) => boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy users data (matching the seeded users)
const DUMMY_USERS: SimpleUser[] = [
  {
    id: '1',
    email: 'admin@clinical-edc.com',
    name: 'Super Admin',
    role: UserRole.SUPER_ADMIN,
    status: UserStatus.ACTIVE,
    organization: {
      name: 'Clinical EDC System',
      type: 'SPONSOR',
      id: 'system'
    },
    permissions: ['read:studies', 'create:studies', 'update:studies', 'delete:studies', 'approve:studies', 'read:sites', 'create:sites', 'update:sites', 'delete:sites', 'read:users', 'create:users', 'update:users', 'delete:users', 'approve:users', 'read:data', 'create:data', 'update:data', 'delete:data', 'export:data', 'manage:system', 'view:audit_logs', 'manage:roles'],
    assignedStudies: [],
    assignedSites: []
  },
  {
    id: '2',
    email: 'study.manager@clinical-edc.com',
    name: 'Study Manager',
    role: UserRole.STUDY_MANAGER,
    status: UserStatus.ACTIVE,
    organization: {
      name: 'Pharmaceutical Company Inc.',
      type: 'SPONSOR',
      id: 'pharma-001'
    },
    permissions: ['read:studies', 'create:studies', 'update:studies', 'read:sites', 'create:sites', 'update:sites', 'read:users', 'create:users', 'update:users', 'read:data', 'create:data', 'update:data', 'export:data'],
    assignedStudies: [],
    assignedSites: []
  },
  {
    id: '3',
    email: 'data.manager@clinical-edc.com',
    name: 'Data Manager',
    role: UserRole.DATA_MANAGER,
    status: UserStatus.ACTIVE,
    organization: {
      name: 'Global CRO Solutions',
      type: 'CRO',
      id: 'cro-001'
    },
    permissions: ['read:studies', 'read:sites', 'read:data', 'create:data', 'update:data', 'delete:data', 'export:data'],
    assignedStudies: [],
    assignedSites: []
  },
  {
    id: '4',
    email: 'pi@clinical-edc.com',
    name: 'Principal Investigator',
    role: UserRole.PRINCIPAL_INVESTIGATOR,
    status: UserStatus.ACTIVE,
    organization: {
      name: 'University Medical Center',
      type: 'SITE',
      id: 'site-001'
    },
    permissions: ['read:studies', 'update:studies', 'read:sites', 'update:sites', 'read:data', 'create:data', 'update:data'],
    assignedStudies: [],
    assignedSites: ['site-001']
  },
  {
    id: '5',
    email: 'coordinator@clinical-edc.com',
    name: 'Site Coordinator',
    role: UserRole.SITE_COORDINATOR,
    status: UserStatus.ACTIVE,
    organization: {
      name: 'University Medical Center',
      type: 'SITE',
      id: 'site-001'
    },
    permissions: ['read:studies', 'read:sites', 'read:data', 'create:data', 'update:data'],
    assignedStudies: [],
    assignedSites: ['site-001']
  },
  {
    id: '6',
    email: 'monitor@clinical-edc.com',
    name: 'Clinical Monitor',
    role: UserRole.MONITOR,
    status: UserStatus.ACTIVE,
    organization: {
      name: 'Global CRO Solutions',
      type: 'CRO',
      id: 'cro-001'
    },
    permissions: ['read:studies', 'read:sites', 'read:data', 'export:data'],
    assignedStudies: [],
    assignedSites: []
  },
  {
    id: '7',
    email: 'viewer@clinical-edc.com',
    name: 'Read Only User',
    role: UserRole.VIEWER,
    status: UserStatus.ACTIVE,
    organization: {
      name: 'Regulatory Agency',
      type: 'REGULATORY',
      id: 'reg-001'
    },
    permissions: ['read:studies', 'read:sites', 'read:data'],
    assignedStudies: [],
    assignedSites: []
  }
];

// Dummy passwords (matching the seeded passwords)
const DUMMY_PASSWORDS: Record<string, string> = {
  'admin@clinical-edc.com': 'Admin123!',
  'study.manager@clinical-edc.com': 'Manager123!',
  'data.manager@clinical-edc.com': 'Data123!',
  'pi@clinical-edc.com': 'PI123456!',
  'coordinator@clinical-edc.com': 'Coord123456!',
  'monitor@clinical-edc.com': 'Monitor123456!',
  'viewer@clinical-edc.com': 'Viewer123456!'
};

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('clinical-edc-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('clinical-edc-user');
      }
    }
    setIsLoading(false);
  }, []);

  const isAuthenticated = !!user;
  const isApproved = user?.status === UserStatus.ACTIVE;

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Super admin has all permissions
    if (user.role === UserRole.SUPER_ADMIN) return true;
    
    return user.permissions.includes(permission);
  };

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;
    
    // Super admin has all roles
    if (user.role === UserRole.SUPER_ADMIN) return true;
    
    return user.role === role;
  };

  const hasStudyAccess = (studyId: string): boolean => {
    if (!user) return false;
    
    // Super admin and admin have access to all studies
    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) return true;
    
    return user.assignedStudies.includes(studyId);
  };

  const hasSiteAccess = (siteId: string): boolean => {
    if (!user) return false;
    
    // Super admin and admin have access to all sites
    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) return true;
    
    return user.assignedSites.includes(siteId);
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = DUMMY_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    const correctPassword = DUMMY_PASSWORDS[email.toLowerCase()];
    
    if (user && password === correctPassword) {
      setUser(user);
      localStorage.setItem('clinical-edc-user', JSON.stringify(user));
      return true;
    }
    
    return false;
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('clinical-edc-user');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    isApproved,
    hasPermission,
    hasRole,
    hasStudyAccess,
    hasSiteAccess,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SimpleAuthProvider');
  }
  return context;
}

// Permission constants
export const Permissions = {
  // Study permissions
  READ_STUDIES: 'read:studies',
  CREATE_STUDIES: 'create:studies',
  UPDATE_STUDIES: 'update:studies',
  DELETE_STUDIES: 'delete:studies',
  APPROVE_STUDIES: 'approve:studies',
  
  // Site permissions
  READ_SITES: 'read:sites',
  CREATE_SITES: 'create:sites',
  UPDATE_SITES: 'update:sites',
  DELETE_SITES: 'delete:sites',
  
  // User permissions
  READ_USERS: 'read:users',
  CREATE_USERS: 'create:users',
  UPDATE_USERS: 'update:users',
  DELETE_USERS: 'delete:users',
  APPROVE_USERS: 'approve:users',
  
  // Data permissions
  READ_DATA: 'read:data',
  CREATE_DATA: 'create:data',
  UPDATE_DATA: 'update:data',
  DELETE_DATA: 'delete:data',
  EXPORT_DATA: 'export:data',
  
  // System permissions
  MANAGE_SYSTEM: 'manage:system',
  VIEW_AUDIT_LOGS: 'view:audit_logs',
  MANAGE_ROLES: 'manage:roles',
} as const; 