
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Card,
  CardContent,
  Skeleton,
  Fade,
  Alert,
  Divider,
  Stack,
  Paper,
  Grid,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  CameraAlt as CameraIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  Link as LinkIcon,
  LocationOn as LocationIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AnimatedBackground from '../common/AnimatedBackground';

const EditContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(4),
  minHeight: '100vh',
  position: 'relative',
}));

const ProfileCard = styled(Card)(({ theme }) => ({
  background: 'rgba(22, 27, 34, 0.8)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(48, 54, 61, 0.5)',
  borderRadius: '24px',
  overflow: 'visible',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #6c5ce7, #fd79a8, #00d4aa)',
    borderRadius: '24px 24px 0 0',
  },
}));

const AvatarSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  background: 'rgba(108, 92, 231, 0.05)',
  borderRadius: '20px',
  border: '1px solid rgba(108, 92, 231, 0.2)',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: '4px solid rgba(108, 92, 231, 0.3)',
  background: 'linear-gradient(135deg, #6c5ce7 0%, #764ba2 100%)',
  color: 'white',
  fontWeight: 700,
  fontSize: '3rem',
  position: 'relative',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    borderColor: 'rgba(108, 92, 231, 0.6)',
  },
}));

const UploadButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(1, 2),
  background: 'rgba(108, 92, 231, 0.1)',
  border: '1px solid rgba(108, 92, 231, 0.3)',
  color: theme.palette.primary.main,
  '&:hover': {
    background: 'rgba(108, 92, 231, 0.2)',
    transform: 'translateY(-2px)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: '2px',
      },
    },
  },
}));

const EditProfileView = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    biography: '',
    website: '',
    location: '',
    avatar: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (!token || !userData) {
          navigate('/login');
          return;
        }
        const user = JSON.parse(userData);
        const response = await fetch(`/api/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const profileData = await response.json();
          setFormData({
            fullName: profileData.fullName || '',
            biography: profileData.biography || '',
            website: profileData.website || '',
            location: profileData.location || '',
            avatar: profileData.avatar || '',
          });
        } else {
          throw new Error('Failed to fetch profile');
        }
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
      
      // Upload to backend
      try {
        const token = localStorage.getItem('token');
        const formDataUpload = new FormData();
        formDataUpload.append('avatar', file);
        const response = await fetch('/api/users/avatar', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataUpload
        });
        if (response.ok) {
          const data = await response.json();
          setFormData(prev => ({ ...prev, avatar: data.avatar }));
          // Update localStorage user avatar
          const userData = JSON.parse(localStorage.getItem('user'));
          userData.avatar = data.avatar;
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to upload avatar');
        }
      } catch (err) {
        setError('Failed to upload avatar');
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      const user = JSON.parse(userData);
      const response = await fetch(`/api/users/${user.userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setSuccess('Profile updated successfully!');
        setTimeout(() => {
          navigate(`/profile/${user.username}`);
        }, 1500);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <EditContainer maxWidth="md">
        <AnimatedBackground />
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="text" width={250} height={40} sx={{ ml: 2 }} />
        </Box>
        <ProfileCard>
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Skeleton variant="circular" width={120} height={120} sx={{ mx: 'auto', mb: 2 }} />
                  <Skeleton variant="rectangular" width={120} height={36} sx={{ mx: 'auto' }} />
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Stack spacing={3}>
                  <Skeleton variant="rectangular" height={56} />
                  <Skeleton variant="rectangular" height={96} />
                  <Skeleton variant="rectangular" height={56} />
                  <Skeleton variant="rectangular" height={56} />
                  <Skeleton variant="rectangular" height={48} />
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </ProfileCard>
      </EditContainer>
    );
  }

  return (
    <EditContainer maxWidth="md">
      <AnimatedBackground />
      <Fade in timeout={600}>
        <Box>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <IconButton 
              onClick={handleBack} 
              sx={{ 
                mr: 2,
                backgroundColor: 'rgba(108, 92, 231, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(108, 92, 231, 0.2)',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <BackIcon sx={{ color: 'primary.main' }} />
            </IconButton>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6c5ce7, #fd79a8)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Edit Profile
            </Typography>
          </Box>

          {/* Alerts */}
          {error && (
            <Fade in>
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 107, 107, 0.1)',
                  border: '1px solid rgba(255, 107, 107, 0.3)',
                }}
              >
                {error}
              </Alert>
            </Fade>
          )}
          {success && (
            <Fade in>
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 3,
                  borderRadius: '16px',
                  backgroundColor: 'rgba(0, 212, 170, 0.1)',
                  border: '1px solid rgba(0, 212, 170, 0.3)',
                }}
              >
                {success}
              </Alert>
            </Fade>
          )}

          <ProfileCard>
            <CardContent sx={{ p: 4 }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={4}>
                  {/* Avatar Section */}
                  <Grid item xs={12} md={4}>
                    <AvatarSection>
                      <StyledAvatar src={formData.avatar}>
                        {!formData.avatar && formData.fullName?.charAt(0)?.toUpperCase()}
                      </StyledAvatar>
                      
                      <Stack spacing={2} alignItems="center">
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          Profile Photo
                        </Typography>
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                          Upload a new profile picture to personalize your account
                        </Typography>
                        
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="avatar-upload"
                          type="file"
                          onChange={handleAvatarChange}
                        />
                        <label htmlFor="avatar-upload">
                          <UploadButton
                            component="span"
                            startIcon={<CameraIcon />}
                          >
                            Change Photo
                          </UploadButton>
                        </label>
                      </Stack>
                    </AvatarSection>
                  </Grid>

                  {/* Form Fields */}
                  <Grid item xs={12} md={8}>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                          Personal Information
                        </Typography>
                        <StyledTextField
                          fullWidth
                          label="Full Name"
                          value={formData.fullName}
                          onChange={handleInputChange('fullName')}
                          placeholder="Enter your full name"
                          InputProps={{
                            startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                          }}
                        />
                      </Box>

                      <StyledTextField
                        fullWidth
                        label="Bio"
                        value={formData.biography}
                        onChange={handleInputChange('biography')}
                        multiline
                        rows={4}
                        placeholder="Tell us about yourself..."
                        helperText="Maximum 150 characters"
                        inputProps={{ maxLength: 150 }}
                        InputProps={{
                          startAdornment: (
                            <InfoIcon sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 2 }} />
                          ),
                        }}
                      />

                      <StyledTextField
                        fullWidth
                        label="Website"
                        value={formData.website}
                        onChange={handleInputChange('website')}
                        placeholder="https://yourwebsite.com"
                        InputProps={{
                          startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                      />

                      <StyledTextField
                        fullWidth
                        label="Location"
                        value={formData.location}
                        onChange={handleInputChange('location')}
                        placeholder="Where are you based?"
                        InputProps={{
                          startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                      />

                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={saving}
                        startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                        sx={{
                          mt: 4,
                          borderRadius: '16px',
                          padding: '12px 32px',
                          background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5f3dc4, #6c5ce7)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(108, 92, 231, 0.3)',
                          },
                          '&:disabled': {
                            background: 'rgba(108, 92, 231, 0.3)',
                          },
                        }}
                      >
                        {saving ? 'Saving Changes...' : 'Save Changes'}
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </ProfileCard>
        </Box>
      </Fade>
    </EditContainer>
  );
};

export default EditProfileView;
