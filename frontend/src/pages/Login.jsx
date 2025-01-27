import React, { useState, useEffect } from "react";
import { Avatar, Button, Container, Typography, Box, CssBaseline, TextField, FormControlLabel, Checkbox, Grid, Grid2 } from "@mui/material";
import { Link } from "react-router-dom";
import { LockOutlined } from "@mui/icons-material";
import { makeStyles } from '@mui/styles';
import { FcGoogle as GoogleIcon } from "react-icons/fc";
import { FaFacebook as FacebookIcon } from "react-icons/fa";
import {useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from "../store/actions/auth";
import backgroundImg from "../assets/bg.jpg"

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 251, 251, 0.04)', // Semi-transparent background
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    backdropFilter: 'blur(4px)',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  background: {
    position: 'relative',
    // backgroundImage: `url(${backgroundImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const Login = () => {

  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // const { isAuthenticated } = useSelector((state) => state.authState);
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate("/");
  //   }
  // }, [isAuthenticated, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/facebook`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <div className={classes.background}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {/* {error && <Typography color="error">{error}</Typography>} */}
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: '30px', marginBottom: '10px', padding: "10px" }}
            >
              Sign In
            </Button>

            {/* Google and Facebook Signin */}
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              sx={{ marginTop: 1 }}
            >
              Other sign in options
            </Typography>
            <Grid2 container spacing={2} style={{ marginTop: '16px', justifyContent: 'center' }}>
              <Grid2 xs={6}>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    borderColor: "#fff",
                    padding: "10px",
                    "&:hover": {
                      borderColor: "#fff",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                  onClick={handleGoogleLogin}
                >
                  <GoogleIcon style={{ fontSize: "24px" }} />
                </Button>
              </Grid2>
              {/* <Grid2 xs={6}>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    borderColor: "#fff",
                    padding: "10px",
                    "&:hover": {
                      borderColor: "#fff",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                  onClick={handleFacebookLogin}
                >
                  <FacebookIcon style={{ fontSize: "24px", color: "#3b5998" }} />
                </Button>
              </Grid2> */}
            </Grid2>

            <Grid2 sx={{ marginTop: 3 }}>

              <Grid2 container justifyContent="center">
                <Typography
                  variant="body2"
                  color="textSecondary"
                >
                  Don't have an account?&nbsp;
                </Typography>
                <Link to='/register' variant="body2" style={{ textDecoration: 'none', color: 'skyblue', fontSize: '14px' }}>
                  Sign Up
                </Link>
              </Grid2>
              <Grid2 container justifyContent="center">
                <Link to="/forgot-password" variant="body2" style={{ textDecoration: 'none', color: 'skyblue', fontSize: '14px' }}>
                  Forgot password?
                </Link>
              </Grid2>
            </Grid2>
          </form>
        </div>
        <Box mt={8}>
        </Box>
      </Container>
    </div>
  );
};

export default Login;
