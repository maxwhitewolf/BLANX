
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  CircularProgress,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  Fade,
  Slide,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Article as ArticleIcon,
  Tag as TagIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../../helpers/authHelper';
import PostCard from '../PostCard';
import { styled } from '@mui/material/styles';
import AnimatedBackground from '../common/AnimatedBackground';

const SearchContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  paddingTop: theme.spacing(10),
  position: 'relative',
}));

const SearchHeader = styled(Box)(({ theme }) => ({
  background: 'rgba(22, 27, 34, 0.8)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  border: '1px solid rgba(48, 54, 61, 0.5)',
  position: 'relative',
  overflow: 'hidden',
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

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTab-root': {
    minHeight: '60px',
    padding: theme.spacing(1.5, 3),
    borderRadius: '16px',
    margin: theme.spacing(0, 0.5),
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    '&:hover': {
      background: 'rgba(108, 92, 231, 0.1)',
      transform: 'translateY(-2px)',
    },
    '&.Mui-selected': {
      background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
      color: 'white',
    },
  },
  '& .MuiTabs-indicator': {
    display: 'none',
  },
}));

const ResultCard = styled(Card)(({ theme }) => ({
  background: 'rgba(22, 27, 34, 0.8)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(48, 54, 61, 0.5)',
  borderRadius: '20px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    borderColor: 'rgba(108, 92, 231, 0.3)',
  },
}));

const SearchView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = isLoggedIn();
  
  const [activeTab, setActiveTab] = useState(0);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [type, setType] = useState(searchParams.get('type') || 'posts');
  const [sortBy, setSortBy] = useState('relevance');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ posts: [], users: [], tags: [] });
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0, hasMore: false });

  const tabTypes = ['posts', 'users', 'tags'];

  useEffect(() => {
    const urlQuery = searchParams.get('q');
    const urlType = searchParams.get('type') || 'posts';
    
    setQuery(urlQuery || '');
    setType(urlType);
    setActiveTab(tabTypes.indexOf(urlType));
    setPage(1);
    
    if (urlQuery && urlQuery.trim().length >= 2) {
      performSearch(urlQuery, urlType, 1, sortBy);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery, searchType, searchPage, searchSortBy) => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/search/${searchType}?q=${encodeURIComponent(searchQuery)}&page=${searchPage}&limit=20&sortBy=${searchSortBy}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setResults(prev => ({ ...prev, [searchType]: data[searchType] || data.posts || data.users || data.tags || [] }));
        setPagination({
          total: data.total || 0,
          totalPages: data.totalPages || 0,
          hasMore: data.hasMore || false
        });
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      const newSearchParams = new URLSearchParams();
      newSearchParams.set('q', query.trim());
      newSearchParams.set('type', type);
      setSearchParams(newSearchParams);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    const newType = tabTypes[newValue];
    setType(newType);
    
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('q', query);
    newSearchParams.set('type', newType);
    setSearchParams(newSearchParams);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    performSearch(query, type, value, sortBy);
  };

  const handleSortChange = (event) => {
    const newSortBy = event.target.value;
    setSortBy(newSortBy);
    setPage(1);
    performSearch(query, type, 1, newSortBy);
  };

  const renderPosts = () => (
    <Stack spacing={3}>
      {results.posts.map((post, index) => (
        <Fade in timeout={300 + index * 100} key={post._id}>
          <Box>
            <PostCard post={post} />
          </Box>
        </Fade>
      ))}
    </Stack>
  );

  const renderUsers = () => (
    <Grid container spacing={3}>
      {results.users.map((user, index) => (
        <Grid item xs={12} sm={6} md={4} key={user._id}>
          <Fade in timeout={300 + index * 100}>
            <ResultCard 
              onClick={() => navigate(`/profile/${user.username}`)}
            >
              <CardContent>
                <Stack alignItems="center" spacing={2}>
                  <Avatar
                    src={user.avatar}
                    sx={{ 
                      width: 80, 
                      height: 80,
                      border: '3px solid rgba(108, 92, 231, 0.3)',
                    }}
                  >
                    <PersonIcon fontSize="large" />
                  </Avatar>
                  <Box textAlign="center">
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 0.5,
                      }}
                    >
                      {user.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {user.fullName || 'No name provided'}
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="center">
                      <Chip 
                        label={`${user.followerCount || 0} followers`} 
                        size="small"
                        sx={{ 
                          background: 'rgba(108, 92, 231, 0.1)',
                          color: 'primary.main',
                        }}
                      />
                      <Chip 
                        label={`${user.postCount || 0} posts`} 
                        size="small"
                        sx={{ 
                          background: 'rgba(253, 121, 168, 0.1)',
                          color: 'secondary.main',
                        }}
                      />
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </ResultCard>
          </Fade>
        </Grid>
      ))}
    </Grid>
  );

  const renderTags = () => (
    <Grid container spacing={3}>
      {results.tags.map((tag, index) => (
        <Grid item xs={12} sm={6} md={4} key={tag.name}>
          <Fade in timeout={300 + index * 100}>
            <ResultCard 
              onClick={() => navigate(`/search?q=${encodeURIComponent(tag.name)}&type=posts`)}
            >
              <CardContent>
                <Stack alignItems="center" spacing={2}>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'secondary.main', 
                      width: 80, 
                      height: 80,
                      background: 'linear-gradient(135deg, #fd79a8, #fdcb6e)',
                    }}
                  >
                    <TagIcon fontSize="large" />
                  </Avatar>
                  <Box textAlign="center">
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 1,
                      }}
                    >
                      #{tag.name}
                    </Typography>
                    <Chip 
                      label={`${tag.count} posts`} 
                      sx={{ 
                        background: 'rgba(0, 212, 170, 0.1)',
                        color: 'success.main',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </ResultCard>
          </Fade>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <SearchContainer>
      <AnimatedBackground />
      <Container maxWidth="lg">
        <Slide direction="down" in timeout={600}>
          <SearchHeader>
            <Typography 
              variant="h3" 
              sx={{ 
                mb: 3, 
                color: 'text.primary', 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6c5ce7, #fd79a8)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Discover & Search
            </Typography>
            
            <form onSubmit={handleSearch}>
              <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Search posts, users, tags..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SearchIcon />}
                  sx={{ 
                    px: 4,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5f3dc4, #6c5ce7)',
                    },
                  }}
                >
                  Search
                </Button>
              </Stack>
            </form>

            <Stack direction="row" alignItems="center" spacing={3}>
              <StyledTabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Posts" icon={<ArticleIcon />} iconPosition="start" />
                <Tab label="Users" icon={<PersonIcon />} iconPosition="start" />
                <Tab label="Tags" icon={<TagIcon />} iconPosition="start" />
              </StyledTabs>

              {type === 'posts' && (
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel sx={{ color: 'text.secondary' }}>Sort by</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={handleSortChange}
                    label="Sort by"
                    sx={{ 
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <MenuItem value="relevance">Relevance</MenuItem>
                    <MenuItem value="likes">Most Liked</MenuItem>
                    <MenuItem value="comments">Most Commented</MenuItem>
                    <MenuItem value="date">Newest</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Stack>
          </SearchHeader>
        </Slide>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} sx={{ color: 'primary.main' }} />
          </Box>
        ) : (
          <Box>
            {pagination.total > 0 ? (
              <Fade in timeout={800}>
                <Box>
                  <Typography 
                    variant="h6" 
                    color="text.secondary" 
                    sx={{ mb: 4, fontWeight: 500 }}
                  >
                    Found {pagination.total} results
                  </Typography>

                  {type === 'posts' && renderPosts()}
                  {type === 'users' && renderUsers()}
                  {type === 'tags' && renderTags()}

                  {pagination.totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                      <Pagination
                        count={pagination.totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                        sx={{
                          '& .MuiPaginationItem-root': {
                            color: 'text.primary',
                            borderRadius: '12px',
                            '&.Mui-selected': {
                              background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
                              color: 'white',
                            },
                            '&:hover': {
                              backgroundColor: 'rgba(108, 92, 231, 0.1)',
                            },
                          },
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Fade>
            ) : (
              <Fade in timeout={800}>
                <Box sx={{ textAlign: 'center', py: 12 }}>
                  <SearchIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h4" color="text.primary" sx={{ mb: 2, fontWeight: 600 }}>
                    No results found
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
                    Try adjusting your search terms or browse different categories to discover amazing content
                  </Typography>
                </Box>
              </Fade>
            )}
          </Box>
        )}
      </Container>
    </SearchContainer>
  );
};

export default SearchView;
