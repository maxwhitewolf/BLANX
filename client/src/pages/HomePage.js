
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
  Fab,
  Skeleton,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import PostCard from '../components/PostCard';

const WelcomeCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.1) 0%, rgba(253, 121, 168, 0.1) 100%)',
  border: '1px solid rgba(108, 92, 231, 0.2)',
  borderRadius: '20px',
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    borderRadius: '16px',
    marginBottom: theme.spacing(2),
  },
}));

const HomePage = ({ user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const postsData = await response.json();
        setPosts(postsData);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleComment = async (postId, content) => {
    try {
      await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content }),
      });
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Failed to comment:', error);
    }
  };

  return (
    <Box>
      <WelcomeCard>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            fontWeight={700}
            sx={{
              background: 'linear-gradient(135deg, #6c5ce7, #fd79a8)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Welcome back, {user?.displayName}!
          </Typography>
          <Typography 
            variant={isMobile ? "body2" : "body1"} 
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Stay connected with your community and share your thoughts.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size={isMobile ? "small" : "medium"}
            sx={{ borderRadius: '12px' }}
          >
            Create Post
          </Button>
        </CardContent>
      </WelcomeCard>

      <Grid container spacing={isMobile ? 2 : 3}>
        <Grid item xs={12} md={8}>
          <Stack spacing={isMobile ? 2 : 3}>
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} sx={{ borderRadius: '20px' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Skeleton variant="circular" width={44} height={44} />
                      <Box sx={{ ml: 2, flexGrow: 1 }}>
                        <Skeleton variant="text" width="40%" />
                        <Skeleton variant="text" width="20%" />
                      </Box>
                    </Box>
                    <Skeleton variant="text" height={60} />
                    <Skeleton variant="rectangular" height={200} sx={{ mt: 2, borderRadius: '12px' }} />
                  </CardContent>
                </Card>
              ))
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUser={user}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              ))
            ) : (
              <Card sx={{ textAlign: 'center', p: 4, borderRadius: '20px' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No posts yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Be the first to share something with the community!
                </Typography>
              </Card>
            )}
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={isMobile ? 2 : 3}>
            <Card sx={{ borderRadius: '20px', p: 2 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Trending Topics
              </Typography>
              <Stack spacing={1}>
                {['#technology', '#design', '#react', '#nodejs'].map((tag) => (
                  <Box
                    key={tag}
                    sx={{
                      p: 1.5,
                      borderRadius: '12px',
                      backgroundColor: 'rgba(108, 92, 231, 0.05)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(108, 92, 231, 0.1)',
                      },
                    }}
                  >
                    <Typography variant="body2" color="primary.main" fontWeight={600}>
                      {tag}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {Math.floor(Math.random() * 100)} posts
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Card>

            <Card sx={{ borderRadius: '20px', p: 2 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Suggested Users
              </Typography>
              <Stack spacing={2}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box sx={{ ml: 2, flexGrow: 1 }}>
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="40%" />
                    </Box>
                    <Button size="small" variant="outlined">
                      Follow
                    </Button>
                  </Box>
                ))}
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
