import React from 'react';
import { TextField } from '@mui/material';

const SearchBar = () => (
  <TextField
    variant="outlined"
    placeholder="Search..."
    size="small"
    fullWidth
    sx={{ maxWidth: '300px', bgcolor: 'none', borderRadius: '5px' }}
  />
);

export default SearchBar;
