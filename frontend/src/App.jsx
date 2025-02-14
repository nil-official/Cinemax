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
  Box,
} from "@mui/material";
import Navbar from "./components/Navbar/Navbar";
import Homepage from "./pages/Homepage";
import Moviepage from "./pages/Moviepage";
import ShowtimesPage from "./pages/Showtimespage";
import SeatLayoutpage from "./pages/SeatLayoutpage";
import Testpage from "./pages/Testpage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SeatPage from "./pages/SeatPage";
import Bookings from "./pages/Bookings";
import BookingSummary from "./pages/BookingSummary";
import RefreshHandler from "./components/RefreshHandler";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Sidebar from "./pages/Admin/components/Sidebar";
import Dashboard from "./pages/Admin/components/Dashboard";
import MoviesList from "./pages/Admin/Movies/MoviesList";
import AddMovie from "./pages/Admin/Movies/AddMovie";
import ScreenList from "./pages/Admin/screens/ScreensList";
import AddScreen from "./pages/Admin/screens/AddScreen";
import ShowtimesList from "./pages/Admin/showtimes/ShowtimesList";
import { Toaster } from "react-hot-toast";
import AddShowtimes from "./pages/Admin/showtimes/AddShowtimes";
const App = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleLogout = () => setUser(null);

  const theme = createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#070910",
        paper: "#151b2e",
      },
      text: {
        primary: "#ffffff",
        secondary: "#b0b0b0",
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
          main: "#18202A",
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

  const AdminLayout = () => {
    return (
      <>
        <Sidebar />
        <Box component="main" sx={{ padding: 2,height:'100vh'
         }}>
          <Outlet />
        </Box>
      </>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Toaster position="bottom-right" reverseOrder={false} />
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
              <Route
                path="/login"
                element={
                  <OAuthWrapper>
                    <Login />
                  </OAuthWrapper>
                }
              />
              <Route
                path="/register"
                element={
                  <OAuthWrapper>
                    <Register />
                  </OAuthWrapper>
                }
              />
              <Route element={<Layout />}>
                <Route path="/" element={<Homepage />} />
                <Route path="/movie/:movieId" element={<Moviepage />} />
                <Route
                  path="/movie/:movieId/showtimes"
                  element={<ShowtimesPage />}
                />
                <Route
                  path="/movie/:movieId/showtimes/:showtimeId/seatlayout"
                  element={<SeatPage />}
                />
                <Route path="/booking/summary" element={<BookingSummary />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/test" element={<Testpage />} />
              </Route>
              {/* Admin Panel Routes */}
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Dashboard/>}/>
                {/* Movies Route */}
                <Route path="/admin/movies" element={<MoviesList />} />
                <Route path="/admin/movies/add" element={<AddMovie />} />
                <Route path="/admin/movies/edit/:id" element={<AddMovie />} />
                {/* Screens Route */}
                <Route path="/admin/screens" element={<ScreenList />} />
                <Route path="/admin/screens/add" element={<AddScreen />} />
                <Route path="/admin/screens/edit/:id" element={<AddScreen />} />
                {/* Showtimes Route */}
                <Route path="/admin/showtimes" element={<ShowtimesList/>}/>
                <Route path="/admin/showtimes/add" element={<AddShowtimes />} />
                <Route path="/admin/showtimes/edit/:id" element={<AddShowtimes />} />
              </Route>
            </Routes>
          </Container>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default App;
