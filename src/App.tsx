import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// Placeholder components - to be implemented
const LoginPage = () => <div className="p-8">Login Page - TODO</div>;
const RegisterPage = () => <div className="p-8">Register Page - TODO</div>;
const DashboardPage = () => <div className="p-8">Dashboard - TODO</div>;
const ConnectionsPage = () => <div className="p-8">Connections Page - TODO</div>;
const APIKeysPage = () => <div className="p-8">API Keys Page - TODO</div>;
const BillingPage = () => <div className="p-8">Billing Page - TODO</div>;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/connections" element={<ConnectionsPage />} />
          <Route path="/api-keys" element={<APIKeysPage />} />
          <Route path="/billing" element={<BillingPage />} />

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
