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
import ClientProfile from './pages/ClientProfile';
import Admin from './pages/Admin';
import Growth from './pages/Growth';
import Documents from './pages/Documents'; // NEW

// New Layout Component specifically for App.tsx structure
const AppLayout = () => (
  <div className="h-screen w-full bg-[#f3f4f6] dark:bg-[#0f172a] p-0 flex items-center justify-center font-['Raleway'] overflow-hidden transition-colors duration-300">
    <div className="app-island w-full h-full max-w-[1920px] bg-white dark:bg-[#111827] rounded-none md:rounded-[20px] shadow-2xl overflow-hidden flex relative border border-gray-200 dark:border-white/10">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1e1b4b] dark:to-[#111827]">
        <Outlet />
      </main>
    </div>
  </div>
);

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { session, loading } = useAuth();
  if (loading) return <div className="h-screen w-full bg-[#111827] flex items-center justify-center text-white">Loading Environment...</div>;
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
            <Route path="compliance" element={<Compliance />} />
            <Route path="growth" element={<Growth />} />
            <Route path="docs" element={<Documents />} />
            <Route path="admin" element={<Admin />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}