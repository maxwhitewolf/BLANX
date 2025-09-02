
import React, { useState, useEffect } from 'react';
import { Badge, IconButton, Box } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import NotificationDropdown from './NotificationDropdown';
import { isLoggedIn } from '../helpers/authHelper';
import { styled, keyframes } from '@mui/material/styles';
import io from 'socket.io-client';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.1)',
    backgroundColor: 'rgba(108, 92, 231, 0.1)',
  },
}));

const AnimatedBadge = styled(Badge)(({ theme, hasNew }) => ({
  '& .MuiBadge-badge': {
    background: 'linear-gradient(135deg, #ff6b6b, #ff8787)',
    color: 'white',
    fontWeight: 600,
    fontSize: '0.75rem',
    minWidth: '20px',
    height: '20px',
    borderRadius: '10px',
    border: '2px solid rgba(22, 27, 34, 1)',
    animation: hasNew ? `${pulse} 2s ease-in-out infinite` : 'none',
    boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)',
  },
}));

const NotificationBadge = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [socket, setSocket] = useState(null);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const user = isLoggedIn();

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      
      // Connect to Socket.io
      const newSocket = io('http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token')
        }
      });
      
      setSocket(newSocket);

      // Listen for real-time notifications
      newSocket.on('new_notification', (notification) => {
        setUnreadCount(prev => prev + 1);
        setHasNewNotification(true);
        
        // Reset animation after 3 seconds
        setTimeout(() => setHasNewNotification(false), 3000);
      });

      // Listen for unread count updates
      newSocket.on('unread_count_update', ({ count }) => {
        setUnreadCount(count);
      });

      // Poll for new notifications every 30 seconds (fallback)
      const interval = setInterval(fetchUnreadCount, 30000);
      
      return () => {
        clearInterval(interval);
        newSocket.disconnect();
      };
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/notifications/unread-count', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
    setHasNewNotification(false); // Stop animation when opened
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const handleNotificationRead = () => {
    fetchUnreadCount();
  };

  if (!user) return null;

  return (
    <Box>
      <StyledIconButton
        color="inherit"
        onClick={handleClick}
        sx={{ 
          position: 'relative',
          color: 'text.primary',
        }}
      >
        <AnimatedBadge 
          badgeContent={unreadCount} 
          color="error"
          hasNew={hasNewNotification}
        >
          <NotificationsIcon sx={{ fontSize: '1.5rem' }} />
        </AnimatedBadge>
      </StyledIconButton>
      
      <NotificationDropdown
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        onNotificationRead={handleNotificationRead}
      />
    </Box>
  );
};

export default NotificationBadge;
