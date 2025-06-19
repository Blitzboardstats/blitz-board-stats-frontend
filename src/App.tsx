import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContextOptimized";
import AuthGuard from "@/components/auth/AuthGuard";
import ErrorBoundary from "@/components/auth/ErrorBoundary";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import TeamManagement from "./pages/TeamManagementOptimized";
import TeamDetails from "./pages/TeamDetails";
import EventDetails from "./pages/EventDetails";
import AuthRedirect from "./pages/AuthRedirect";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import Stats from "./pages/Stats";
import Schedule from "./pages/Schedule";
import DesignSystem from "./pages/DesignSystem";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Only retry network errors, not auth errors
        if (
          error?.message?.includes("auth") ||
          error?.message?.includes("unauthorized")
        ) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const App = () => {
  console.log("App: Rendering main application");

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Public routes */}
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Login />} />
                <Route path='/auth-redirect' element={<AuthRedirect />} />

                {/* Hidden design system route (not linked in navigation) */}
                <Route path='/design-system' element={<DesignSystem />} />

                {/* Root route - redirect to login if not authenticated, teams if authenticated */}
                <Route path='/' element={<Index />} />

                {/* Protected routes wrapped in AuthGuard */}
                <Route
                  path='/profile'
                  element={
                    <AuthGuard>
                      <Profile />
                    </AuthGuard>
                  }
                />
                <Route
                  path='/teams'
                  element={
                    <AuthGuard>
                      <TeamManagement />
                    </AuthGuard>
                  }
                />
                <Route
                  path='/team/:teamId'
                  element={
                    <AuthGuard>
                      <TeamDetails />
                    </AuthGuard>
                  }
                />
                <Route
                  path='/schedule'
                  element={
                    <AuthGuard>
                      <Schedule />
                    </AuthGuard>
                  }
                />
                <Route
                  path='/stats'
                  element={
                    <AuthGuard>
                      <Stats />
                    </AuthGuard>
                  }
                />
                <Route
                  path='/search'
                  element={
                    <AuthGuard>
                      <Search />
                    </AuthGuard>
                  }
                />
                <Route
                  path='/event/:eventId'
                  element={
                    <AuthGuard>
                      <EventDetails />
                    </AuthGuard>
                  }
                />

                <Route path='*' element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
