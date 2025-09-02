
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Box,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  useMediaQuery,
  useTheme,
  Fade,
  Collapse,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import {
  Favorite as LikeIcon,
  FavoriteBorder as LikeOutlineIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(22, 27, 34, 0.8)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(48, 54, 61, 0.5)',
  borderRadius: '20px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  marginBottom: theme.spacing(3),
  overflow: 'visible',
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    borderRadius: '16px',
    marginBottom: theme.spacing(2),
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    borderColor: 'rgba(108, 92, 231, 0.3)',
    [theme.breakpoints.down('sm')]: {
      transform: 'translateY(-2px)',
    },
  },
}));

const PostHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2, 1, 2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5, 1.5, 1, 1.5),
  },
}));

const PostContent = styled(CardContent)(({ theme }) => ({
  paddingTop: 0,
  paddingBottom: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 1.5, 1, 1.5),
  },
}));

const PostActions = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(1, 2, 2, 2),
  justifyContent: 'space-between',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 1.5, 1.5, 1.5),
  },
}));

const ActionButton = styled(IconButton)(({ theme, active }) => ({
  borderRadius: '12px',
  padding: theme.spacing(1),
  transition: 'all 0.3s ease',
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  backgroundColor: active ? 'rgba(108, 92, 231, 0.1)' : 'transparent',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5),
  },
  '&:hover': {
    backgroundColor: active 
      ? 'rgba(108, 92, 231, 0.15)' 
      : 'rgba(108, 92, 231, 0.08)',
    transform: 'scale(1.05)',
  },
}));

const TagChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5, 0.5, 0.5, 0),
  borderRadius: '16px',
  fontSize: '0.75rem',
  height: '24px',
  background: 'rgba(108, 92, 231, 0.1)',
  color: theme.palette.primary.main,
  border: '1px solid rgba(108, 92, 231, 0.3)',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.7rem',
    height: '20px',
  },
  '&:hover': {
    background: 'rgba(108, 92, 231, 0.15)',
    transform: 'scale(1.05)',
  },
}));

const CommentSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 2, 2, 2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 1.5, 1.5, 1.5),
  },
}));

const PostCard = ({ 
  post, 
  onLike, 
  onComment, 
  onShare, 
  onEdit, 
  onDelete, 
  currentUser 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(post.liked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleLike = async () => {
    try {
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      if (onLike) await onLike(post._id);
    } catch (error) {
      setIsLiked(isLiked);
      setLikesCount(prev => isLiked ? prev + 1 : prev - 1);
    }
  };

  const handleComment = async () => {
    if (commentText.trim() && onComment) {
      await onComment(post._id, commentText);
      setCommentText('');
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      return postDate.toLocaleDateString();
    }
  };

  return (
    <Fade in timeout={600}>
      <StyledCard>
        <PostHeader>
          <Avatar
            src={post.author?.avatar}
            sx={{
              width: isMobile ? 36 : 44,
              height: isMobile ? 36 : 44,
              mr: 1.5,
              border: '2px solid',
              borderColor: 'primary.main',
            }}
          >
            {post.author?.displayName?.[0]}
          </Avatar>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography 
              variant={isMobile ? "subtitle2" : "subtitle1"} 
              fontWeight={600}
              color="text.primary"
            >
              {post.author?.displayName || 'Unknown User'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography 
                variant="caption" 
                color="text.secondary"
              >
                @{post.author?.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                •
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(post.createdAt)}
              </Typography>
            </Box>
          </Box>

          <IconButton
            size={isMobile ? "small" : "medium"}
            onClick={handleMenuOpen}
            sx={{ ml: 1 }}
          >
            <MoreIcon />
          </IconButton>
        </PostHeader>

        <PostContent>
          <Typography 
            variant={isMobile ? "body2" : "body1"} 
            color="text.primary"
            sx={{ 
              mb: 2, 
              lineHeight: 1.6,
              wordBreak: 'break-word',
            }}
          >
            {post.content}
          </Typography>

          {post.image && (
            <Box
              component="img"
              src={post.image}
              alt="Post content"
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: isMobile ? 300 : 400,
                objectFit: 'cover',
                borderRadius: '12px',
                mb: 2,
              }}
            />
          )}

          {post.tags && post.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1 }}>
              {post.tags.map((tag, index) => (
                <TagChip 
                  key={index} 
                  label={`#${tag}`} 
                  size={isMobile ? "small" : "medium"}
                />
              ))}
            </Box>
          )}
        </PostContent>

        <PostActions>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ActionButton 
              active={isLiked}
              onClick={handleLike}
              size={isMobile ? "small" : "medium"}
            >
              {isLiked ? <LikeIcon /> : <LikeOutlineIcon />}
            </ActionButton>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ minWidth: '20px' }}
            >
              {likesCount}
            </Typography>

            <ActionButton 
              onClick={() => setShowComments(!showComments)}
              size={isMobile ? "small" : "medium"}
            >
              <CommentIcon />
            </ActionButton>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ minWidth: '20px' }}
            >
              {post.comments?.length || 0}
            </Typography>
          </Box>

          <ActionButton 
            onClick={() => onShare && onShare(post._id)}
            size={isMobile ? "small" : "medium"}
          >
            <ShareIcon />
          </ActionButton>
        </PostActions>

        <Collapse in={showComments}>
          <CommentSection>
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              mb: 2,
              flexDirection: isMobile ? 'column' : 'row',
            }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                multiline={isMobile}
                maxRows={isMobile ? 3 : 1}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  },
                }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleComment}
                disabled={!commentText.trim()}
                sx={{ 
                  borderRadius: '20px',
                  minWidth: isMobile ? 'auto' : '80px',
                  alignSelf: isMobile ? 'flex-end' : 'center',
                }}
                endIcon={<SendIcon />}
              >
                {isMobile ? '' : 'Post'}
              </Button>
            </Box>

            {post.comments?.map((comment, index) => (
              <Box key={index} sx={{ mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Avatar 
                    src={comment.author?.avatar} 
                    sx={{ 
                      width: isMobile ? 24 : 28, 
                      height: isMobile ? 24 : 28, 
                      mr: 1 
                    }}
                  >
                    {comment.author?.displayName?.[0]}
                  </Avatar>
                  <Typography 
                    variant="caption" 
                    fontWeight={600}
                    color="text.primary"
                  >
                    {comment.author?.displayName}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ ml: 1 }}
                  >
                    {formatDate(comment.createdAt)}
                  </Typography>
                </Box>
                <Typography 
                  variant={isMobile ? "caption" : "body2"} 
                  color="text.primary"
                  sx={{ ml: isMobile ? 4 : 4.5 }}
                >
                  {comment.content}
                </Typography>
              </Box>
            ))}
          </CommentSection>
        </Collapse>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { minWidth: 150 }
          }}
        >
          {currentUser?._id === post.author?._id && [
            <MenuItem key="edit" onClick={() => { onEdit && onEdit(post._id); handleMenuClose(); }}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              Edit
            </MenuItem>,
            <MenuItem key="delete" onClick={() => { onDelete && onDelete(post._id); handleMenuClose(); }}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              Delete
            </MenuItem>
          ]}
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <ShareIcon fontSize="small" />
            </ListItemIcon>
            Share
          </MenuItem>
        </Menu>
      </StyledCard>
    </Fade>
  );
};

export default PostCard;
