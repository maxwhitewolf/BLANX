
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { globalTheme } from './theme/globalTheme';
import AnimatedBackground from './components/common/AnimatedBackground';
import NotificationBadge from './components/NotificationBadge';

function App() {
  return (
    <ThemeProvider theme={globalTheme}>
      <CssBaseline />
      <AnimatedBackground />
      <Router>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <NotificationBadge />
          <Routes>
            <Route path="/" element={<div>Welcome to Blanx</div>} />
            <Route path="/notifications" element={<div>Notifications Page</div>} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
