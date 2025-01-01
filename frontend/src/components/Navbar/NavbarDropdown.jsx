import React from 'react';
import { Menu, MenuItem, Button } from '@mui/material';

const NavbarDropdown = ({ user, onLogout }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button onClick={handleMenu} color="inherit">
        {user ? user.username : 'Login'}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {user ? (
          <>
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={() => { onLogout(); handleClose(); }}>Logout</MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={handleClose}>Sign Up</MenuItem>
            <MenuItem onClick={handleClose}>Login</MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

export default NavbarDropdown;
