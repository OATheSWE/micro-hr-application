"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const { state, login, signup, clearError, clearSuccess } = useAuth();
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Auto-dismiss error and success after 5 seconds
  useEffect(() => {
    if (state.error) {
      const timer = setTimeout(() => {
        clearError();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.error, clearError]);

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        clearSuccess();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.success, clearSuccess]);

  // Handle redirects in useEffect to avoid setState during render
  useEffect(() => {
    console.log("Auth state changed:", {
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      isLoading: state.isLoading,
    });

    if (state.isAuthenticated && state.user) {
      console.log("User is authenticated, redirecting...", {
        role: state.user.role,
      });
      if (state.user.role === "admin") {
        console.log("Redirecting to admin dashboard");
        router.push("/admin/dashboard");
      } else {
        console.log("Redirecting to employee profile");
        router.push("/employee/profile");
      }
    }
  }, [state.isAuthenticated, state.user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignup) {
      // Validate password confirmation
      if (password !== confirmPassword) {
        clearError();
        // We'll handle this error in the component state
        return;
      }
      await signup(email, password, "admin");
    } else {
      await login(email, password);
    }
  };

  const handleDemoLogin = async (role: "admin" | "employee") => {
    const credentials =
      role === "admin"
        ? { email: "admin@hrsystem.com", password: "admin123" }
        : { email: "employee@hrsystem.com", password: "employee123" };

    setEmail(credentials.email);
    setPassword(credentials.password);
    await login(credentials.email, credentials.password);
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    clearError();
    clearSuccess();
  };

  // Show loading while checking authentication
  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
        />
      </div>
    );
  }

  // Don't render login form if already authenticated (redirect will happen in useEffect)
  if (state.isAuthenticated && state.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-b-2 border-blue-600"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">HR System</h1>
          <p className="text-gray-600">Employee Management Portal</p>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900">
              {isSignup ? "Create Admin Account" : "Welcome Back"}
            </h2>
            <p className="text-gray-600 mt-2">
              {isSignup
                ? "Sign up as an administrator"
                : "Sign in to your account"}
            </p>
            {isSignup && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-sm text-blue-600 mt-2 font-medium"
              >
                Only administrators can create new accounts
              </motion.p>
            )}
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 text-black py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your email"
                required
              />
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-black px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 transition-all duration-300 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            {/* Confirm Password Input (Signup only) */}
            <AnimatePresence>
              {isSignup && (
                <motion.div
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full text-black px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 transition-all duration-300 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Password Mismatch Error */}
            <AnimatePresence>
              {isSignup &&
                password &&
                confirmPassword &&
                password !== confirmPassword && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4"
                  >
                    <p className="text-red-600 text-sm">
                      Passwords do not match
                    </p>
                  </motion.div>
                )}
            </AnimatePresence>

            {/* Success Message */}
            <AnimatePresence>
              {state.success && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="bg-green-50 border border-green-200 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-green-600 text-sm">{state.success}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {state.error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4"
                >
                  <p className="text-red-600 text-sm">{state.error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button
                type="submit"
                disabled={
                  state.isLoading || (isSignup && password !== confirmPassword)
                }
                className="w-full"
                size="lg"
                variant="secondary"
              >
                {state.isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2" size={20} />
                    {isSignup ? "Creating account..." : "Signing in..."}
                  </div>
                ) : isSignup ? (
                  "Create Admin Account"
                ) : (
                  "Sign In"
                )}
              </Button>
            </motion.div>
          </form>

          {/* Toggle Mode Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-gray-600">
              {isSignup
                ? "Already have an account?"
                : "Need to create an admin account?"}
              <button
                onClick={toggleMode}
                className="ml-1 text-blue-600 hover:text-blue-800 font-medium"
              >
                {isSignup ? "Sign in" : "Sign up"}
              </button>
            </p>
          </motion.div>

          {/* Demo Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 pt-6 border-t border-gray-200"
          >
            <p className="text-center text-sm text-gray-600 mb-4">
              Try demo accounts:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => handleDemoLogin("admin")}
                  disabled={state.isLoading}
                  variant="destructive"
                  className="w-full"
                >
                  Admin Demo
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => handleDemoLogin("employee")}
                  disabled={state.isLoading}
                  variant="outline"
                  className="bg-purple-600 text-white hover:bg-purple-700 border-purple-600 w-full"
                >
                  Employee Demo
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-center text-sm text-gray-500"
        >
          <p>© 2024 HR System. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
