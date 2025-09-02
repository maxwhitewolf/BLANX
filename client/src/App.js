
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { globalTheme } from './theme/globalTheme';
import ResponsiveLayout from './components/Layout/ResponsiveLayout';
import AnimatedBackground from './components/common/AnimatedBackground';
import NotificationBadge from './components/NotificationBadge';

// Page components (to be created)
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import MessagesPage from './pages/MessagesPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user data
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  if (loading) {
    return (
      <ThemeProvider theme={globalTheme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: globalTheme.palette.background.default,
          }}
        >
          <AnimatedBackground />
          {/* Add loading spinner here */}
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={globalTheme}>
      <CssBaseline />
      <Router>
        {!isAuthenticated ? (
          <Routes>
            <Route 
              path="/login" 
              element={<LoginPage onLogin={handleLogin} />} 
            />
            <Route 
              path="/register" 
              element={<RegisterPage onLogin={handleLogin} />} 
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <ResponsiveLayout user={user}>
            <NotificationBadge />
            <Routes>
              <Route path="/" element={<HomePage user={user} />} />
              <Route path="/search" element={<SearchPage user={user} />} />
              <Route path="/profile" element={<ProfilePage user={user} />} />
              <Route path="/notifications" element={<NotificationsPage user={user} />} />
              <Route path="/messages" element={<MessagesPage user={user} />} />
              <Route path="/settings" element={<SettingsPage user={user} onLogout={handleLogout} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ResponsiveLayout>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;
