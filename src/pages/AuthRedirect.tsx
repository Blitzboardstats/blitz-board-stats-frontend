import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

const AuthRedirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const email = searchParams.get("email");
    const action = searchParams.get("action");

    console.log({ isAuthenticated, user });

    if (isAuthenticated && user) {
      navigate("/teams");
    } else {
      const signupUrl = email
        ? `/signup?email=${encodeURIComponent(email)}`
        : "/signup";
      navigate(signupUrl);
    }
  }, [isAuthenticated, user, navigate, searchParams]);

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blitz-purple'></div>
    </div>
  );
};

export default AuthRedirect;
