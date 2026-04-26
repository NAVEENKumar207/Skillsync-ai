import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn, getToken, clearSession } from "../utils/api";

function ProtectedRoute({ children }) {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      const token = getToken();
      if (!token) {
        setIsAuthenticated(false);
        setIsValidating(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          setIsAuthenticated(true);
        } else if (res.status === 401) {
          // Token expired or invalid
          clearSession();
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Auth validation error:", err);
        setIsAuthenticated(isLoggedIn());
      }
      setIsValidating(false);
    };

    validateToken();
  }, []);

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">
          Verifying session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
