import "./App.css";
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
} from "@mui/material";
import Navbar from "./components/Navbar/Navbar";
import Homepage from "./pages/Homepage";
import Moviepage from "./pages/Moviepage";
import ShowtimesPage from "./pages/Showtimespage";
import SeatLayoutpage from "./pages/SeatLayoutpage";
import Testpage from "./pages/Testpage";
import Login from "./pages/Login"
import Register from "./pages/Register";
import SeatPage from "./pages/SeatPage";
import Bookings from "./pages/Bookings";
import BookingSummary from "./pages/BookingSummary";
import RefreshHandler from "./components/RefreshHandler";
import { GoogleOAuthProvider } from "@react-oauth/google";

const App = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => setUser(null);

  const theme = createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#070910", // App background color
        paper: "#151b2e", // Navbar and surface background color
      },
      text: {
        primary: "#ffffff", // Text color for better contrast
        secondary: "#b0b0b0", // Secondary text color
      },
      primary: {
        main: "#90caf9",
      },
      secondary: {
        main: "#f48fb1",
      },
      error: {
        main: "#f44336",
      },
      custom: {
        glow: {
          main: "#18202A", // Glow color
        },
      },
    },
  });

  const Layout = () => {
    return (
      <>
        <Navbar user={user} onLogout={handleLogout} />
        <Outlet />
      </>
    );
  };

  const OAuthWrapper = ({ children }) => (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );

  // const PrivateRoute = ({ element }) => {
  //   return isAuthenticated ? element : <Navigate to="/" />
  // }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
        <Container
          width="100%"
          height="100vh"
          sx={{
            backgroundImage:
              "radial-gradient(circle, rgb(12, 22, 54) 0%, rgba(7,9,16,1) 65%)",
          }}
        >
          <Container>
            <Routes>
              <Route path="/login" element={<OAuthWrapper><Login /></OAuthWrapper>} />
              <Route path="/register" element={<OAuthWrapper><Register /></OAuthWrapper>} />
              <Route element={<Layout />}>
                <Route path="/" element={<Homepage />} />
                <Route path="/movie/:movieId" element={<Moviepage />} />
                <Route path="/movie/:movieId/showtimes" element={<ShowtimesPage />} />
                <Route path="/movie/:movieId/showtimes/:showtimeId/seatlayout" element={<SeatPage />} />
                <Route path="/booking/summary" element={<BookingSummary />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/test" element={<Testpage />} />
              </Route>
            </Routes>
          </Container>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default App;
