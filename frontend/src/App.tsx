import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import People from './pages/People';
import Hiring from './pages/Hiring';
import TimeTracker from './pages/TimeTracker';
import Chat from './pages/Chat';
import NotFound from './pages/NotFound';
import { AuthProvider, useAuth } from './context/AuthContext'; // See step 4

// Protect routes that require login
const ProtectedRoute = ({ children }) => {
  const { session } = useAuth();
  if (!session) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="people" element={<People />} />
            <Route path="hiring" element={<Hiring />} />
            <Route path="time" element={<TimeTracker />} />
            <Route path="chat" element={<Chat />} />
            {/* Add other routes here */}
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}