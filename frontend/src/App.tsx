import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import People from './pages/People';
import Hiring from './pages/Hiring';
import TimeTracker from './pages/TimeTracker';
import Finance from './pages/Finance';
import Compliance from './pages/Compliance';
import Chat from './pages/Chat';
import TaskBoard from './pages/TaskBoard'; 
import ClientProfile from './pages/ClientProfile';
import Admin from './pages/Admin';
import Growth from './pages/Growth';
import Documents from './pages/Documents';
import NotFound from './pages/NotFound';

const AppLayout = () => {
  return (
    // 1. OUTER CONTAINER: Uses dynamic background (e.g., deep blue in Map theme)
    <div className="h-screen w-screen bg-[var(--color-bg)] p-0 font-['Raleway'] overflow-hidden transition-colors duration-500">
      
      {/* 2. APP ISLAND: Uses the specific 'island' variable (prevents white flashes) */}
      <div className="app-island w-full h-full bg-[var(--color-island)] rounded-none shadow-none overflow-hidden flex relative border-none">
        <Sidebar />
        
        {/* 3. MAIN CONTENT: 
             - REMOVED: bg-gradient-to-br from-gray-50 ... (The Culprit!)
             - ADDED: bg-[var(--color-bg)] to ensure the main area matches the theme
        */}
        <main className="flex-1 h-full overflow-y-auto overflow-x-auto min-w-0 relative bg-[var(--color-bg)] transition-colors duration-500">
            <Outlet />
        </main>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { session, loading } = useAuth();
  if (loading) return <div className="h-screen w-full bg-[var(--color-bg)] flex items-center justify-center text-[var(--color-text)]">Loading Environment...</div>;
  if (!session) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="context" element={<ClientProfile />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="people" element={<People />} />
            <Route path="hiring" element={<Hiring />} />
            <Route path="time" element={<TimeTracker />} />
            <Route path="finance" element={<Finance />} />
            <Route path="chat" element={<Chat />} />
            <Route path="tasks" element={<TaskBoard />} />
            <Route path="compliance" element={<Compliance />} />
            <Route path="growth" element={<Growth />} />
            <Route path="docs" element={<Documents />} />
            <Route path="admin" element={<Admin />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}