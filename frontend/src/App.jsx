import './App.css';
import "./assets/fonts/OvercameDemoRegular.ttf"
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Container } from '@mui/material';
import Navbar from './components/Navbar/Navbar';
import Homepage from './pages/Homepage';
import Moviepage from './pages/Moviepage';
import Showtimespage from './pages/Showtimespage';
import SeatLayoutpage from './pages/SeatLayoutpage';
import Testpage from './pages/Testpage';

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogout = () => setUser(null);

  const theme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#070910', // App background color
        paper: '#151b2e',   // Navbar and surface background color
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
      error: {
        main: '#f44336',
      },
      custom: {
        glow: {
          main: '#18202A', // Glow color
        } 
      }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Container width="100%" height="100%" sx={{backgroundImage: 'radial-gradient(circle, rgb(12, 22, 54) 0%, rgba(7,9,16,1) 65%)'}}>
        <Container>
          <Navbar user={user} onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/movie/:movieId" element={<Moviepage />} />
            <Route path="/movie/:movieId/showtimes" element={<Showtimespage />} />
            <Route path="/movie/:movieId/showtimes/:showtimeId/seatlayout" element={<SeatLayoutpage />} />
            <Route path="/test" element={<Testpage />} />
          </Routes>
        </Container>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default App;
