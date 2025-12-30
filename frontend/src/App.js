import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import Quests from './pages/Quests/Quests';
import Inventory from './pages/Inventory/Inventory';
import Skills from './pages/Skills/Skills';
import Guilds from './pages/Guilds/Guilds';
import Leaderboards from './pages/Leaderboards/Leaderboards';
import Chat from './pages/Chat/Chat';

// Components
import LoadingScreen from './components/UI/LoadingScreen';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';

// Styles
import './styles/App.css';
import './styles/globals.css';
import './styles/animations.css';

// Create QueryClient for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

// Public Route component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/dashboard" replace />;
  
  return children;
};

// Main Layout component
const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-content">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <SocketProvider>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </SocketProvider>
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <SocketProvider>
                    <Layout>
                      <Profile />
                    </Layout>
                  </SocketProvider>
                </ProtectedRoute>
              } />
              
              <Route path="/quests" element={
                <ProtectedRoute>
                  <SocketProvider>
                    <Layout>
                      <Quests />
                    </Layout>
                  </SocketProvider>
                </ProtectedRoute>
              } />
              
              <Route path="/inventory" element={
                <ProtectedRoute>
                  <SocketProvider>
                    <Layout>
                      <Inventory />
                    </Layout>
                  </SocketProvider>
                </ProtectedRoute>
              } />
              
              <Route path="/skills" element={
                <ProtectedRoute>
                  <SocketProvider>
                    <Layout>
                      <Skills />
                    </Layout>
                  </SocketProvider>
                </ProtectedRoute>
              } />
              
              <Route path="/guilds" element={
                <ProtectedRoute>
                  <SocketProvider>
                    <Layout>
                      <Guilds />
                    </Layout>
                  </SocketProvider>
                </ProtectedRoute>
              } />
              
              <Route path="/leaderboards" element={
                <ProtectedRoute>
                  <SocketProvider>
                    <Layout>
                      <Leaderboards />
                    </Layout>
                  </SocketProvider>
                </ProtectedRoute>
              } />
              
              <Route path="/chat" element={
                <ProtectedRoute>
                  <SocketProvider>
                    <Layout>
                      <Chat />
                    </Layout>
                  </SocketProvider>
                </ProtectedRoute>
              } />
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            
            {/* Global notifications */}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1a1a1a',
                  color: '#fff',
                  border: '1px solid #333',
                },
                success: {
                  iconTheme: {
                    primary: '#4CAF50',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#f44336',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;