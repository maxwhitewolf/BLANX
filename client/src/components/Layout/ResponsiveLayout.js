
import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Container,
  Fab,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import AnimatedBackground from '../common/AnimatedBackground';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(22, 27, 34, 0.95)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid #30363d',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  zIndex: theme.zIndex.drawer + 1,
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    background: 'rgba(22, 27, 34, 0.98)',
    backdropFilter: 'blur(20px)',
    border: 'none',
    borderRight: '1px solid #30363d',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  minHeight: '100vh',
  paddingTop: '64px',
  [theme.breakpoints.up('md')]: {
    marginLeft: 280,
  },
  [theme.breakpoints.down('sm')]: {
    paddingTop: '56px',
  },
}));

const FloatingActionButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
  zIndex: theme.zIndex.speedDial,
  [theme.breakpoints.down('sm')]: {
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    width: 48,
    height: 48,
  },
}));

const NavigationItem = styled(ListItem)(({ theme, active }) => ({
  borderRadius: '12px',
  margin: '4px 16px',
  transition: 'all 0.3s ease',
  backgroundColor: active ? 'rgba(108, 92, 231, 0.12)' : 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(108, 92, 231, 0.08)',
    transform: 'translateX(4px)',
  },
}));

const BrandTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  background: 'linear-gradient(135deg, #6c5ce7, #fd79a8)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.25rem',
  },
}));

const ResponsiveLayout = ({ children, user }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const navigationItems = [
    { icon: <HomeIcon />, text: 'Home', path: '/' },
    { icon: <SearchIcon />, text: 'Search', path: '/search' },
    { icon: <NotificationsIcon />, text: 'Notifications', path: '/notifications' },
    { icon: <MessageIcon />, text: 'Messages', path: '/messages' },
    { icon: <PersonIcon />, text: 'Profile', path: '/profile' },
    { icon: <SettingsIcon />, text: 'Settings', path: '/settings' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, borderBottom: '1px solid #30363d' }}>
        <BrandTypography variant="h5">
          Blanx
        </BrandTypography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Professional Social Platform
        </Typography>
      </Box>
      
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {navigationItems.map((item) => (
          <NavigationItem
            key={item.text}
            button
            active={location.pathname === item.path}
            onClick={() => handleNavigate(item.path)}
          >
            <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: location.pathname === item.path ? 600 : 400,
              }}
            />
          </NavigationItem>
        ))}
      </List>

      {user && (
        <Box sx={{ p: 2, borderTop: '1px solid #30363d' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              borderRadius: '12px',
              backgroundColor: 'rgba(108, 92, 231, 0.05)',
              cursor: 'pointer',
            }}
            onClick={handleUserMenuOpen}
          >
            <Avatar
              src={user.avatar}
              sx={{
                width: 40,
                height: 40,
                mr: 2,
                border: '2px solid',
                borderColor: 'primary.main',
              }}
            >
              {user.displayName?.[0]}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {user.displayName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                @{user.username}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AnimatedBackground />
      
      <StyledAppBar position="fixed">
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          )}
          
          <BrandTypography variant="h6" sx={{ flexGrow: 1 }}>
            Blanx
          </BrandTypography>

          {!isMobile && user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton color="inherit">
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton color="inherit">
                <Badge badgeContent={2} color="error">
                  <MessageIcon />
                </Badge>
              </IconButton>
              <IconButton onClick={handleUserMenuOpen}>
                <Avatar
                  src={user.avatar}
                  sx={{ width: 32, height: 32 }}
                >
                  {user.displayName?.[0]}
                </Avatar>
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </StyledAppBar>

      <Box component="nav">
        <StyledDrawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
        >
          {drawer}
        </StyledDrawer>
      </Box>

      <MainContent>
        <Container
          maxWidth="lg"
          sx={{
            py: { xs: 2, sm: 3 },
            px: { xs: 1, sm: 2 },
          }}
        >
          {children}
        </Container>
      </MainContent>

      <FloatingActionButton
        onClick={() => navigate('/create-post')}
        aria-label="Create post"
      >
        <AddIcon />
      </FloatingActionButton>

      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 200,
          },
        }}
      >
        <MenuItem onClick={() => handleNavigate('/profile')}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          My Profile
        </MenuItem>
        <MenuItem onClick={() => handleNavigate('/settings')}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => console.log('Logout')}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ResponsiveLayout;
