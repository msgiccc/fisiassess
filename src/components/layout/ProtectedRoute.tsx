import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: ('guru' | 'siswa' | 'admin')[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isInitialized, user } = useAuthStore();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-slate-900 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role as any)) {
    // If user doesn't have the right role, send them to their own dashboard
    return <Navigate to={user.role === 'guru' ? '/dashboard' : '/dashboard-siswa'} replace />;
  }

  return <Outlet />;
}
