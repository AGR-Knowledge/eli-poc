'use client';

import React from 'react';
import { useAuth, UserStatus } from '@/lib/simple-auth';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRole?: string;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredPermissions = [], 
  requiredRole,
  fallback 
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated, isApproved, hasPermission, hasRole } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return fallback || <AuthenticationRequired />;
  }

  // Check if user is approved
  if (!isApproved) {
    return <AccountPendingApproval />;
  }

  // Check role requirements
  if (requiredRole && !hasRole(requiredRole as any)) {
    return <InsufficientRole requiredRole={requiredRole} userRole={user?.role} />;
  }

  // Check permission requirements
  const missingPermissions = requiredPermissions.filter(
    permission => !hasPermission(permission)
  );

  if (missingPermissions.length > 0) {
    return <InsufficientPermissions missingPermissions={missingPermissions} />;
  }

  // All checks passed, render children
  return <>{children}</>;
}

function AuthenticationRequired() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-xl">Authentication Required</CardTitle>
          <CardDescription>
            You need to sign in to access this page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full">
            <a href="/auth/signin">Sign In</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function AccountPendingApproval() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <CardTitle className="text-xl">Account Pending Approval</CardTitle>
          <CardDescription>
            Your account is awaiting administrator approval
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Please contact your system administrator to activate your account. 
              You will be notified via email once your account is approved.
            </AlertDescription>
          </Alert>
          <Button variant="outline" asChild className="w-full">
            <a href="/auth/signout">Sign Out</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function InsufficientRole({ requiredRole, userRole }: { requiredRole: string; userRole?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-xl">Insufficient Role</CardTitle>
          <CardDescription>
            You don't have the required role to access this page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>
              Required role: <strong>{requiredRole}</strong><br />
              Your role: <strong>{userRole || 'None'}</strong>
            </AlertDescription>
          </Alert>
          <Button variant="outline" asChild className="w-full">
            <a href="/">Go to Dashboard</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function InsufficientPermissions({ missingPermissions }: { missingPermissions: string[] }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-xl">Insufficient Permissions</CardTitle>
          <CardDescription>
            You don't have the required permissions to access this page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>
              Missing permissions:
              <ul className="mt-2 list-disc list-inside">
                {missingPermissions.map(permission => (
                  <li key={permission}>{permission}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
          <Button variant="outline" asChild className="w-full">
            <a href="/">Go to Dashboard</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Higher-order component for easier usage
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
} 