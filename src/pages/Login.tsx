import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/authStore";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import AuthLayout from "@/components/auth/AuthLayout";
import ErrorBoundary from "@/components/auth/ErrorBoundary";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  // Determine initial tab based on route
  useEffect(() => {
    if (location.pathname === "/signup") {
      setActiveTab("signup");
    } else {
      setActiveTab("login");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/teams");
    }
  }, [isAuthenticated]);

  const handleToggle = () => {
    const newTab = activeTab === "login" ? "signup" : "login";
    setActiveTab(newTab);
  };

  return (
    <ErrorBoundary>
      <AuthLayout>
        <div className='bg-card rounded-lg border border-border shadow-sm p-6 w-full max-w-md'>
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "login" | "signup")}
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-2 mb-6 bg-muted'>
              <TabsTrigger
                value='login'
                className='data-[state=active]:bg-card data-[state=active]:text-gray-900'
              >
                Blitz In
              </TabsTrigger>
              <TabsTrigger
                value='signup'
                className='data-[state=active]:bg-card data-[state=active]:text-gray-900'
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value='login'>
              <LoginForm onToggle={handleToggle} />
            </TabsContent>

            <TabsContent value='signup'>
              <SignupForm changeTab={handleToggle} />
            </TabsContent>
          </Tabs>
        </div>
      </AuthLayout>
    </ErrorBoundary>
  );
};

export default Login;
