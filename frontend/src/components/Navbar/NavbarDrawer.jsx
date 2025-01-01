import React from 'react';
import { Drawer, Box, Typography, Divider } from '@mui/material';
import SearchBar from './SearchBar';

const NavbarDrawer = ({ open, onClose, user, onLogout }) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box p={2} width="250px" role="presentation">
        {/* Search */}
        <SearchBar />

        <Divider sx={{ my: 2 }} />

        {/* User Options */}
        {user ? (
          <>
            <Typography onClick={onClose}>Profile</Typography>
            <Typography onClick={() => { onLogout(); onClose(); }}>Logout</Typography>
          </>
        ) : (
          <>
            <Typography onClick={onClose}>Sign Up</Typography>
            <Typography onClick={onClose}>Login</Typography>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default NavbarDrawer;
