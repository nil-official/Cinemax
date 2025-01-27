import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid2 from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { makeStyles } from '@mui/styles';
import Container from "@mui/material/Container";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../store/actions/auth";// Adjust the import path as necessary
import { useNavigate } from "react-router-dom";
import backgroundImg from "../assets/images/bg.jpg"

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
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  background: {
    position: 'relative',
    backgroundImage: `url(${backgroundImg})`,
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
  const { isAuthenticated } = useSelector((state) => state.authState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Redirect to homepage
    }
  }, [isAuthenticated, navigate]);

  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(username, password)); // Dispatch the login action
	// toast.success('Login successful!');
  };

  return (
    <div className={classes.background}>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {/* {error && <Typography color="error">{error}</Typography>} Display error message */}
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            className={classes.submit}
			      style={{marginBottom: '10px'}}
          >
            Sign In
          </Button>
          <Grid2 container justifyContent="space-between">
            <Grid2 >
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid2>
            <Grid2 >
              <Link href='/register' variant="body2">
                {"Don't have an account? Sign Up"}
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