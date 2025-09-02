
import React from 'react';
import { Box } from '@mui/material';
import SearchView from '../components/views/SearchView';

const SearchPage = ({ user }) => {
  return (
    <Box>
      <SearchView user={user} />
    </Box>
  );
};

export default SearchPage;
