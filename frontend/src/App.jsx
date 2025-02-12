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
import Sidebar from "./pages/Admin/components/Sidebar";
import MoviesList from "./pages/Admin/Movies/MoviesList";
import AddMovie from "./pages/Admin/Movies/AddMovie";
import ScreenList from "./pages/Admin/screens/ScreensList";
import AddScreen from "./pages/Admin/screens/AddScreen";
import { Toaster } from "react-hot-toast";


const App = () => {
  const [user, setUser ] = useState(null);

  const handleLogout = () => setUser (null);

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

  const AdminLayout = () => {
    return (
      <>
        <Sidebar />
        <Box component="main" sx={{ padding: 2,
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
        <Container
          width="100%"
          height="100vh"
          sx={{
            backgroundImage:
              "radial-gradient(circle, rgb(12, 22, 54) 0%, rgba(7,9,16,1) 65%)",
          }}
      
        >
          <Routes>
            {/* Public Routes */}
            <Route element={<Layout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Homepage />} />
              <Route path="/movie/:movieId" element={<Moviepage />} />
              <Route path="/movie/:movieId/showtimes" element={<ShowtimesPage />} />
              <Route path="/movie/:movieId/showtimes/:showtimeId/seatlayout" element={<SeatPage />} />
              <Route path="/test" element={<Testpage />} />
            </Route>

            {/* Admin Panel Routes */}
            <Route element={<AdminLayout />}>
              <Route path="/admin/movies" element={<MoviesList />} />
              <Route path="/admin/movies/add" element={<AddMovie />} />
              <Route path="/admin/movies/edit/:id" element={<AddMovie />} />
              {/* Screens Route */}
              <Route path="/admin/screens" element={<ScreenList/>}/>
              <Route path="/admin/screens/add" element={<AddScreen/>}/>
              <Route path="/admin/screens/edit/:id" element={<AddScreen/>}/>

            </Route>
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default App;