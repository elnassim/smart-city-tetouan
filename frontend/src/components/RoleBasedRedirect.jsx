import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { getDashboardSummaryByClerkId } from '../services/api';

/**
 * RoleBasedRedirect component
 * Redirects users based on their role:
 * - ADMIN → /admin/dashboard
 * - CITOYEN/OPERATOR → /dashboard (citizen dashboard)
 */
export default function RoleBasedRedirect() {
  const { user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const data = await getDashboardSummaryByClerkId(user.id);
        // Get user role from backend
        const role = data.user?.role || 'CITOYEN';
        setUserRole(role);
      } catch (error) {
        console.error('Error checking user role:', error);
        // Default to CITOYEN if error
        setUserRole('CITOYEN');
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      checkUserRole();
    }
  }, [user?.id, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.25rem',
        color: '#6b7280'
      }}>
        <div className="spinner" style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e5e7eb',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }}></div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Redirect based on role
  if (userRole === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // CITOYEN or OPERATOR goes to citizen dashboard
  return <Navigate to="/dashboard" replace />;
}
