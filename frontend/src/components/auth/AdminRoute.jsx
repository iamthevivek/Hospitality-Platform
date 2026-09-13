import { useAuth, useUser } from '../../lib/auth';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';

export default function AdminRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const location = useLocation();
  
  if (!isLoaded) return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner /></div>;
  if (!isSignedIn) return <Navigate to="/sign-in" state={{ from: location }} replace />;
  
  const isAdmin = user?.role === 'ADMIN' || user?.publicMetadata?.role === 'ADMIN' || localStorage.getItem('role') === 'ADMIN';
  
  if (!isAdmin) return <div className="flex justify-center items-center min-h-screen"><h1 className="text-2xl font-bold text-gray-800">403 - Forbidden: Administrator Access Required</h1></div>;
  
  return children;
}
