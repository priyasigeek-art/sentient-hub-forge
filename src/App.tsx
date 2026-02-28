import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import GeneralSettings from "./pages/GeneralSettings";
import AIEnginesPage from "./pages/AIEnginesPage";
import UsersPage from "./pages/UsersPage";
import WebsiteBuilderPage from "./pages/WebsiteBuilderPage";
import NotificationsPage from "./pages/NotificationsPage";
import ApiKeysPage from "./pages/ApiKeysPage";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="settings" element={<GeneralSettings />} />
            <Route path="ai-engines" element={<AIEnginesPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="website-builder" element={<WebsiteBuilderPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="api-keys" element={<ApiKeysPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
