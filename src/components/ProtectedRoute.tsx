import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../services/firebase";
import { ALLOWED_ADMIN_EMAIL } from "../config/admin";

const ProtectedRoute = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="section-padding">
        <div className="container-custom">
          <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-dark-800">
            <p className="text-gray-600 dark:text-gray-300">Checking access...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.isAnonymous || user.email !== ALLOWED_ADMIN_EMAIL) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
