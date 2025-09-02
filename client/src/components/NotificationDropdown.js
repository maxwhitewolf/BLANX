
import React, { useState, useEffect } from 'react';
import {
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Button,
  Divider,
  Chip,
  Fade,
  CircularProgress,
  Stack,
} from '@mui/material';
import {
  Close as CloseIcon,
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
  PersonAdd as PersonAddIcon,
  Article as ArticleIcon,
  CheckCircle as CheckIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledPopover = styled(Popover)(({ theme }) => ({
  '& .MuiPaper-root': {
    background: 'rgba(22, 27, 34, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(48, 54, 61, 0.5)',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    width: '400px',
    maxHeight: '500px',
    overflow: 'hidden',
  },
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
  padding: theme.spacing(2.5),
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    animation: 'float 6s ease-in-out infinite',
  },
  '@keyframes float': {
    '0%, 100%': { transform: 'translate(0, 0)' },
    '50%': { transform: 'translate(-20px, -20px)' },
  },
}));

const NotificationItem = styled(ListItem)(({ theme, isRead }) => ({
  padding: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  borderLeft: isRead ? 'none' : '4px solid #6c5ce7',
  background: isRead ? 'transparent' : 'rgba(108, 92, 231, 0.05)',
  '&:hover': {
    background: 'rgba(108, 92, 231, 0.1)',
    transform: 'translateX(4px)',
  },
}));

const NotificationDropdown = ({ open, anchorEl, onClose, onNotificationRead }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
      
      if (onNotificationRead) {
        onNotificationRead();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    setMarkingAllRead(true);
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/notifications/read-all', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      
      if (onNotificationRead) {
        onNotificationRead();
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    } finally {
      setMarkingAllRead(false);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    
    onClose();
    
    switch (notification.type) {
      case 'like':
      case 'comment':
        navigate(`/posts/${notification.postId}`);
        break;
      case 'follow':
        navigate(`/profile/${notification.fromUser.username}`);
        break;
      default:
        break;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <FavoriteIcon sx={{ color: 'error.main' }} />;
      case 'comment':
        return <CommentIcon sx={{ color: 'info.main' }} />;
      case 'follow':
        return <PersonAddIcon sx={{ color: 'success.main' }} />;
      default:
        return <ArticleIcon sx={{ color: 'primary.main' }} />;
    }
  };

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case 'like':
        return `liked your post "${notification.postTitle}"`;
      case 'comment':
        return `commented on your post "${notification.postTitle}"`;
      case 'follow':
        return 'started following you';
      default:
        return notification.message;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <StyledPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <HeaderBox>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {unreadCount} unread
              </Typography>
            )}
          </Box>
          <Stack direction="row" spacing={1}>
            {unreadCount > 0 && (
              <IconButton 
                size="small" 
                onClick={markAllAsRead}
                disabled={markingAllRead}
                sx={{ color: 'white' }}
              >
                {markingAllRead ? (
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                ) : (
                  <CheckIcon />
                )}
              </IconButton>
            )}
            <IconButton size="small" onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </Stack>
      </HeaderBox>

      <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: 'primary.main' }} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((notification, index) => (
              <Fade in timeout={300 + index * 100} key={notification._id}>
                <Box>
                  <NotificationItem
                    isRead={notification.isRead}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        src={notification.fromUser?.avatar}
                        sx={{ width: 44, height: 44 }}
                      >
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: notification.isRead ? 400 : 600,
                              color: 'text.primary',
                            }}
                          >
                            {notification.fromUser?.username}
                          </Typography>
                          {!notification.isRead && (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: 'primary.main',
                              }}
                            />
                          )}
                        </Stack>
                      }
                      secondary={
                        <Box>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'text.secondary',
                              mb: 0.5,
                            }}
                          >
                            {getNotificationText(notification)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </NotificationItem>
                  {index < notifications.length - 1 && (
                    <Divider sx={{ borderColor: 'rgba(48, 54, 61, 0.5)' }} />
                  )}
                </Box>
              </Fade>
            ))}
          </List>
        )}
      </Box>

      {notifications.length > 5 && (
        <Box sx={{ p: 2, borderTop: '1px solid rgba(48, 54, 61, 0.5)' }}>
          <Button
            fullWidth
            variant="text"
            onClick={() => {
              onClose();
              navigate('/notifications');
            }}
            sx={{
              color: 'primary.main',
              '&:hover': {
                background: 'rgba(108, 92, 231, 0.1)',
              },
            }}
          >
            View All Notifications
          </Button>
        </Box>
      )}
    </StyledPopover>
  );
};

export default NotificationDropdown;
