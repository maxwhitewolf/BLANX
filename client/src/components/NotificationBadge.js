import React, { useState, useEffect } from 'react';
import { Badge, IconButton, Box } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import NotificationDropdown from './NotificationDropdown';
import { isLoggedIn } from '../helpers/authHelper';
import io from 'socket.io-client';

const NotificationBadge = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [socket, setSocket] = useState(null);
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
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  if (!user) return null;

  return (
    <Box>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ position: 'relative' }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <NotificationDropdown
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        onNotificationRead={fetchUnreadCount}
      />
    </Box>
  );
};

export default NotificationBadge; 