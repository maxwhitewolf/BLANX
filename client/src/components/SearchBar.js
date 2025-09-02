
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Chip,
  CircularProgress,
  Fade,
  Slide,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Person as PersonIcon,
  Article as ArticleIcon,
  Tag as TagIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../helpers/authHelper';
import { styled } from '@mui/material/styles';

const SearchContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: 500,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '25px',
    background: 'rgba(22, 27, 34, 0.8)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(48, 54, 61, 0.5)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      background: 'rgba(22, 27, 34, 0.9)',
      borderColor: theme.palette.primary.main,
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(108, 92, 231, 0.2)',
    },
    '&.Mui-focused': {
      background: 'rgba(22, 27, 34, 1)',
      borderColor: theme.palette.primary.main,
      boxShadow: '0 0 0 3px rgba(108, 92, 231, 0.1)',
    },
  },
  '& .MuiInputBase-input': {
    padding: '14px 0',
    fontSize: '1rem',
    color: theme.palette.text.primary,
    '&::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.7,
    },
  },
}));

const SuggestionsPaper = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  zIndex: 1000,
  marginTop: theme.spacing(1),
  maxHeight: 450,
  overflow: 'auto',
  background: 'rgba(22, 27, 34, 0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(48, 54, 61, 0.5)',
  borderRadius: '16px',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(108, 92, 231, 0.3)',
    borderRadius: '3px',
    '&:hover': {
      background: 'rgba(108, 92, 231, 0.5)',
    },
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: '12px',
  margin: theme.spacing(0.5, 1),
  cursor: 'pointer',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'rgba(108, 92, 231, 0.1)',
    transform: 'translateX(8px)',
  },
}));

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState({ posts: [], users: [], tags: [] });
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const user = isLoggedIn();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim() || query.trim().length < 2) {
        setSuggestions({ posts: [], users: [], tags: [] });
        setShowSuggestions(false);
        return;
      }

      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/search/combined?q=${encodeURIComponent(query)}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setSuggestions({
            posts: data.posts || [],
            users: data.users || [],
            tags: data.tags || []
          });
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (type, item) => {
    setShowSuggestions(false);
    setQuery('');
    
    switch (type) {
      case 'post':
        navigate(`/posts/${item._id}`);
        break;
      case 'user':
        navigate(`/profile/${item.username}`);
        break;
      case 'tag':
        navigate(`/search?q=${encodeURIComponent(item.name)}&type=posts`);
        break;
      default:
        break;
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions({ posts: [], users: [], tags: [] });
    setShowSuggestions(false);
  };

  const totalSuggestions = suggestions.posts.length + suggestions.users.length + suggestions.tags.length;

  return (
    <SearchContainer ref={searchRef}>
      <form onSubmit={handleSearch}>
        <StyledTextField
          fullWidth
          placeholder="Search posts, users, tags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setShowSuggestions(true)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {loading && <CircularProgress size={20} sx={{ color: 'primary.main' }} />}
                {query && (
                  <IconButton size="small" onClick={clearSearch}>
                    <ClearIcon sx={{ color: 'text.secondary' }} />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
      </form>

      <Slide direction="down" in={showSuggestions && totalSuggestions > 0} mountOnEnter unmountOnExit>
        <SuggestionsPaper>
          <List sx={{ py: 1 }}>
            {suggestions.posts.map((post, index) => (
              <Fade in timeout={300 + index * 50} key={post._id}>
                <StyledListItem onClick={() => handleSuggestionClick('post', post)}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                      <ArticleIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {post.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        by {post.poster.username}
                      </Typography>
                    }
                  />
                </StyledListItem>
              </Fade>
            ))}

            {suggestions.users.map((user, index) => (
              <Fade in timeout={300 + index * 50} key={user._id}>
                <StyledListItem onClick={() => handleSuggestionClick('user', user)}>
                  <ListItemAvatar>
                    <Avatar src={user.avatar} sx={{ width: 40, height: 40 }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {user.username}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {user.fullName || `${user.followerCount} followers`}
                      </Typography>
                    }
                  />
                </StyledListItem>
              </Fade>
            ))}

            {suggestions.tags.map((tag, index) => (
              <Fade in timeout={300 + index * 50} key={tag.name}>
                <StyledListItem onClick={() => handleSuggestionClick('tag', tag)}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                      <TagIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        #{tag.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {tag.count} posts
                      </Typography>
                    }
                  />
                </StyledListItem>
              </Fade>
            ))}
          </List>
        </SuggestionsPaper>
      </Slide>
    </SearchContainer>
  );
};

export default SearchBar;
