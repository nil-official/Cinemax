import './App.css';
import "./assets/fonts/OvercameDemoRegular.ttf"
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Container } from '@mui/material';
import Navbar from './components/Navbar/Navbar';
import Homepage from './pages/Homepage';

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogout = () => setUser(null);

  const theme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#202124', // App background color
        paper: '#25272c',   // Navbar and surface background color
      },
      text: {
        primary: '#ffffff', // Text color for better contrast
        secondary: '#b0b0b0', // Secondary text color
      },
      primary: {
        main: '#90caf9',
      },
      secondary: {
        main: '#f48fb1',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Container>
          <Navbar user={user} onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Homepage />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default App;
