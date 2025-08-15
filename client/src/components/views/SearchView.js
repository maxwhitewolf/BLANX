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
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Article as ArticleIcon,
  Tag as TagIcon,
} from '@mui/icons-material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../../helpers/authHelper';
import PostCard from '../PostCard';
import { styled } from '@mui/material/styles';

const SearchContainer = styled(Box)(({ theme }) => ({
  paddingTop: 80,
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
    <Box>
      {results.posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </Box>
  );

  const renderUsers = () => (
    <Grid container spacing={2}>
      {results.users.map((user) => (
        <Grid item xs={12} sm={6} md={4} key={user._id}>
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
            },
            transition: 'all 0.3s ease'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={user.avatar}
                  sx={{ width: 50, height: 50 }}
                >
                  <PersonIcon />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {user.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.fullName || `${user.followerCount} followers`}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.postCount} posts
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderTags = () => (
    <Grid container spacing={2}>
      {results.tags.map((tag) => (
        <Grid item xs={12} sm={6} md={4} key={tag.name}>
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
            },
            transition: 'all 0.3s ease'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <TagIcon />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    #{tag.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tag.count} posts
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <SearchContainer>
      <Container maxWidth="lg">
        {/* Search Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 2, color: 'white', fontWeight: 600 }}>
            Search Results
          </Typography>
          
          <form onSubmit={handleSearch}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                placeholder="Search posts, users, tags..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 2,
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                startIcon={<SearchIcon />}
                sx={{ px: 4 }}
              >
                Search
              </Button>
            </Box>
          </form>

          {/* Filters */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ color: 'white' }}>
              <Tab label="Posts" icon={<ArticleIcon />} iconPosition="start" />
              <Tab label="Users" icon={<PersonIcon />} iconPosition="start" />
              <Tab label="Tags" icon={<TagIcon />} iconPosition="start" />
            </Tabs>

            {type === 'posts' && (
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
                  label="Sort by"
                  sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                >
                  <MenuItem value="relevance">Relevance</MenuItem>
                  <MenuItem value="likes">Most Liked</MenuItem>
                  <MenuItem value="comments">Most Commented</MenuItem>
                  <MenuItem value="date">Newest</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        </Box>

        {/* Results */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {pagination.total > 0 ? (
              <>
                <Typography variant="body2" color="white" sx={{ mb: 2 }}>
                  Found {pagination.total} results
                </Typography>

                {type === 'posts' && renderPosts()}
                {type === 'users' && renderUsers()}
                {type === 'tags' && renderTags()}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={pagination.totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      sx={{
                        '& .MuiPaginationItem-root': {
                          color: 'white',
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          },
                        },
                      }}
                    />
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="white" sx={{ mb: 2 }}>
                  No results found
                </Typography>
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                  Try adjusting your search terms or browse different categories
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Container>
    </SearchContainer>
  );
};

export default SearchView; 