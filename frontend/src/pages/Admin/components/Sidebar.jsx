import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Toolbar,
  AppBar,
  Divider,
  styled
} from "@mui/material";
import {
  Menu as MenuIcon,
  MovieCreation,
  Dashboard,
  LocalMovies,
  Logout,
  Schedule,
  Tv,
  ConfirmationNumber,

  QrCode
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/actions/auth";


const drawerWidth = 280;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const Sidebar = () => {
  const theme = useTheme();
  const location = useLocation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/admin" },
    { text: "Movies Management", icon: <LocalMovies />, path: "/admin/movies" },
    { text: "Screens Management", icon: <Tv />, path: "/admin/screens" },
    { text: "Showtimes Management", icon: <Schedule />, path: "/admin/showtimes" },
    { text: "Bookings Management", icon: <ConfirmationNumber />, path: "/admin/bookings" },
    { text: "Ticket Management", icon: <QrCode />, path: "/admin/tickets" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const drawer = (
    <>
      <Toolbar sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(2),
      }}>
        <MovieCreation sx={{ mr: 1, color: theme.palette.primary.main }} />

        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
          CINEMAX ADMIN
        </Typography>

      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                margin: '4px 8px',
                borderRadius: '8px',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(144, 202, 249, 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(144, 202, 249, 0.12)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(144, 202, 249, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{
                minWidth: 40,
                color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.text.secondary
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  '& .MuiTypography-root': {
                    color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.text.primary,
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ mt: 'auto' }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              margin: '4px 8px',
              borderRadius: '8px',
              color: theme.palette.error.main,
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: theme.palette.error.main }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" onClick={handleLogout} />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: theme.palette.background.paper,
          boxShadow: 'none',
          borderBottom: `1px solid ${theme.palette.divider}`,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <StyledDrawer
          variant="permanent"
          sx={{ display: { xs: 'none', md: 'block' } }}
          open
        >
          {drawer}
        </StyledDrawer>
      </Box>

      {/* Main content wrapper */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          mt: '30px',
        }}
      >
        {/* Main content goes here */}
      </Box>
    </Box>
  );
};

export default Sidebar;