import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/auth/LoginForm';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './components/dashboard/Dashboard';
import UsersManagement from './components/users/UsersManagement';
import EquinesManagement from './components/equines/EquinesManagement';
import HealthBooksManagement from './components/health-books/HealthBooksManagement';
import StablesManagement from './components/stables/StablesManagement';
import TravelsManagement from './components/travels/TravelsManagement';
import CoatsManagement from './components/coats/CoatsManagement';
import BreedsManagement from './components/breeds/BreedsManagement';
import NotFound from "./pages/NotFound";
import SettingsManagement from './components/settings/SettingsManagement';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginForm />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/users" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <UsersManagement />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/equines" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <EquinesManagement />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/health-books" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <HealthBooksManagement />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/stables" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <StablesManagement />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/travels" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <TravelsManagement />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/coats" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <CoatsManagement />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/breeds" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <BreedsManagement />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <SettingsManagement />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
