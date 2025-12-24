import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { getDashboardSummaryByClerkId } from '../services/api';

export default function AdminRoute({ children }) {
  const { user, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const data = await getDashboardSummaryByClerkId(user.id);
        // Check if user has ADMIN role from backend
        setIsAdmin(data.user?.role === 'ADMIN');
      } catch (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      checkAdminRole();
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
        Vérification des permissions...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (isAdmin === false) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Accès refusé</h2>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          Vous n&apos;avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <button
          onClick={() => window.location.href = '/dashboard'}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Retour au tableau de bord
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
