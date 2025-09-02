
import React, { useState } from "react";
import { 
  Card, 
  Box, 
  Stack, 
  Typography, 
  IconButton, 
  Button,
  Avatar,
  Chip,
  Fade,
  Collapse,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { 
  Edit as EditIcon,
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
} from '@mui/icons-material';
import ContentUpdateEditor from "./ContentUpdateEditor";
import { isLoggedIn } from "../helpers/authHelper";
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(22, 27, 34, 0.8)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(48, 54, 61, 0.5)',
  borderRadius: '20px',
  marginBottom: theme.spacing(3),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'visible',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    borderColor: 'rgba(108, 92, 231, 0.3)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #6c5ce7, #fd79a8, #00d4aa)',
    borderRadius: '20px 20px 0 0',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover::before': {
    opacity: 1,
  },
}));

const PostHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2, 2.5, 1, 2.5),
}));

const PostContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 2.5, 2, 2.5),
}));

const PostImage = styled('img')(({ theme }) => ({
  width: '100%',
  maxHeight: '400px',
  objectFit: 'cover',
  borderRadius: '16px',
  marginBottom: theme.spacing(2),
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(1),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.1)',
    backgroundColor: 'rgba(108, 92, 231, 0.1)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(1, 2),
  textTransform: 'none',
  fontWeight: 600,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const PostCard = (props) => {
  const { post: postData, removePost } = props;
  const [post, setPost] = useState(postData);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [liked, setLiked] = useState(post.isLiked || false);
  const [saved, setSaved] = useState(post.isSaved || false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const user = isLoggedIn();
  const isAuthor = user && user.username === post.poster.username;
  const navigate = useNavigate();

  const handleDeletePost = async (e) => {
    e.stopPropagation();
    if (!confirm) {
      setConfirm(true);
    } else {
      setLoading(true);
      const token = localStorage.getItem('token');
      await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setLoading(false);
      if (removePost) removePost(post);
      else navigate("/");
    }
  };

  const handleEditPost = (e) => {
    e.stopPropagation();
    setEditing(!editing);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) return;
    
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/posts/${post._id}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      setLiked(liked);
      setLikeCount(prev => liked ? prev + 1 : prev - 1);
    }
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!user) return;
    
    setSaved(!saved);
    
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/posts/${post._id}/save`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      setSaved(saved);
    }
  };

  const handleSubmit = async (e, selectedImage) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      const formData = new FormData();
      formData.append('content', e.target.content.value);
      formData.append('userId', userData._id);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      const response = await fetch(`/api/posts/${post._id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (response.ok) {
        const updatedPost = await response.json();
        setPost({ ...post, ...updatedPost });
        setEditing(false);
      } else {
        setEditing(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in timeout={600}>
      <StyledCard>
        <PostHeader>
          <Avatar 
            src={post.poster.avatar} 
            sx={{ 
              width: 48, 
              height: 48,
              border: '2px solid rgba(108, 92, 231, 0.3)',
            }}
          >
            {post.poster.username.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                color: 'text.primary',
                cursor: 'pointer',
                '&:hover': { color: 'primary.main' }
              }}
              onClick={() => navigate(`/profile/${post.poster.username}`)}
            >
              {post.poster.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(post.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          {isAuthor && (
            <Stack direction="row" spacing={1}>
              <ActionButton onClick={handleEditPost} disabled={loading}>
                <EditIcon fontSize="small" />
              </ActionButton>
              <ActionButton 
                onClick={handleDeletePost} 
                disabled={loading}
                sx={{ 
                  color: confirm ? 'error.main' : 'text.secondary',
                  '&:hover': { 
                    backgroundColor: confirm ? 'rgba(255, 107, 107, 0.1)' : 'rgba(108, 92, 231, 0.1)'
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </ActionButton>
            </Stack>
          )}
        </PostHeader>

        <Collapse in={!editing}>
          <PostContent>
            {post.image && (
              <PostImage src={post.image} alt="Post" />
            )}
            
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 2, 
                fontWeight: 600, 
                color: 'text.primary',
                lineHeight: 1.3,
              }}
            >
              {post.title}
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3, 
                color: 'text.primary',
                lineHeight: 1.6,
              }}
            >
              {post.content}
            </Typography>

            {post.tags && post.tags.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                {post.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={`#${tag}`}
                    size="small"
                    sx={{
                      background: 'rgba(108, 92, 231, 0.1)',
                      color: 'primary.main',
                      border: '1px solid rgba(108, 92, 231, 0.3)',
                      '&:hover': {
                        background: 'rgba(108, 92, 231, 0.2)',
                        cursor: 'pointer',
                      },
                    }}
                    onClick={() => navigate(`/search?q=${encodeURIComponent(tag)}&type=posts`)}
                  />
                ))}
              </Stack>
            )}

            <Divider sx={{ mb: 2, borderColor: 'rgba(48, 54, 61, 0.5)' }} />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={2}>
                <ActionButton onClick={handleLike} disabled={!user}>
                  {liked ? (
                    <FavoriteIcon sx={{ color: 'error.main' }} fontSize="small" />
                  ) : (
                    <FavoriteBorderIcon fontSize="small" />
                  )}
                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                    {likeCount}
                  </Typography>
                </ActionButton>

                <ActionButton onClick={() => navigate(`/posts/${post._id}`)}>
                  <CommentIcon fontSize="small" />
                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                    {post.commentCount || 0}
                  </Typography>
                </ActionButton>

                <ActionButton>
                  <ShareIcon fontSize="small" />
                </ActionButton>
              </Stack>

              <ActionButton onClick={handleSave} disabled={!user}>
                {saved ? (
                  <BookmarkIcon sx={{ color: 'warning.main' }} fontSize="small" />
                ) : (
                  <BookmarkBorderIcon fontSize="small" />
                )}
              </ActionButton>
            </Stack>
          </PostContent>
        </Collapse>

        <Collapse in={editing}>
          <Box sx={{ p: 2.5 }}>
            <ContentUpdateEditor
              originalContent={post.content}
              originalImage={post.image}
              handleSubmit={handleSubmit}
            />
          </Box>
        </Collapse>

        {confirm && (
          <Box sx={{ p: 2, pt: 0 }}>
            <Typography variant="body2" color="error.main" sx={{ mb: 2 }}>
              Are you sure you want to delete this post?
            </Typography>
            <Stack direction="row" spacing={2}>
              <StyledButton 
                variant="outlined" 
                color="error" 
                onClick={handleDeletePost}
                disabled={loading}
              >
                Confirm Delete
              </StyledButton>
              <StyledButton 
                variant="outlined" 
                onClick={() => setConfirm(false)}
                disabled={loading}
              >
                Cancel
              </StyledButton>
            </Stack>
          </Box>
        )}
      </StyledCard>
    </Fade>
  );
};

export default PostCard;
