import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { User, UserRole } from "@/types/userTypes";

// Custom hook to provide auth state and actions
export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    signup,
    setUser,
    setToken,
    setLoading,
    setError,
    clearError,
  } = useAuthStore();

  // Computed values for backward compatibility
  const isAdmin = user?.role === "coach" || user?.role === "admin";
  const isCoach = user?.role === "coach" || user?.role === "admin";

  // Initialize auth state on mount
  useEffect(() => {
    // TODO: Check if token is valid and refresh if needed
    if (token && !user) {
      // Validate token or refresh user data
      console.log("Token exists but no user data, should validate/refresh");
    }
  }, [token, user]);

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      // TODO: Implement actual profile update API call
      console.log("Profile update:", updates);

      // Placeholder - replace with actual API call
      setUser({ ...user, ...updates });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Profile update failed"
      );
    }
  };

  return {
    user,
    token,
    session: null, // Return null for session since we're moving away from Supabase
    isAuthenticated,
    isAdmin,
    isCoach,
    loading: isLoading,
    error,
    login,
    logout,
    signup,
    updateProfile,
    clearError,
  };
};
