import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LockKeyhole, LogIn } from "lucide-react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { ALLOWED_ADMIN_EMAIL } from "../config/admin";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !user.isAnonymous && user.email === ALLOWED_ADMIN_EMAIL) {
        navigate("/admin/contacts", { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const credentials = await signInWithEmailAndPassword(auth, email, password);

      if (credentials.user.email !== ALLOWED_ADMIN_EMAIL) {
        await auth.signOut();
        setError("This account is not allowed to access the admin inbox.");
        return;
      }

      const redirectPath =
        typeof location.state === "object" &&
        location.state !== null &&
        "from" in location.state &&
        typeof location.state.from === "object" &&
        location.state.from !== null &&
        "pathname" in location.state.from &&
        typeof location.state.from.pathname === "string"
          ? location.state.from.pathname
          : "/admin/contacts";

      navigate(redirectPath, { replace: true });
    } catch (submitError) {
      console.error("Login failed:", submitError);
      setError("Invalid credentials or Email/Password auth is not enabled.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-16">
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-dark-800"
          >
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400">
                <LockKeyhole size={28} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Login
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Sign in to view contact submissions.
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Allowed account: {ALLOWED_ADMIN_EMAIL}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-gray-700 dark:bg-dark-900 dark:text-white"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-gray-700 dark:bg-dark-900 dark:text-white"
                  placeholder="Your password"
                />
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-300">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-xl bg-primary-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogIn size={18} className="mr-2" />
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Return to <Link to="/" className="text-primary-600 hover:underline">Home</Link>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Login;
