import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const session = useSession();

  useEffect(() => {
    const checkAuth = async () => {
      if (!session) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        setIsAuthenticated(true);
        setUserRole(profile?.role || null);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [session]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  if (userRole === 'gamemaster' && !requiredRole) {
    return <Navigate to="/game-edition" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;