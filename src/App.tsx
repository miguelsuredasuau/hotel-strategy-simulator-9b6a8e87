import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import GameEditionDashboard from "./components/GameEditionDashboard";
import GameSelectionPage from "./components/GameEdition/GameSelectionPage";
import OptionsPage from "./components/GameEdition/Options/OptionsPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
          if (!session) {
            queryClient.clear();
            localStorage.clear();
          }
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Session initialization error:', error);
        setSession(null);
        // Redirect to login page on session error
        window.location.href = '/login';
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase} initialSession={session}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/game-edition"
                element={
                  <ProtectedRoute requiredRole="gamemaster">
                    <GameSelectionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/game-edition/:gameId"
                element={
                  <ProtectedRoute requiredRole="gamemaster">
                    <GameEditionDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/game-edition/:gameId/turn/:turnId/options"
                element={
                  <ProtectedRoute requiredRole="gamemaster">
                    <OptionsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;