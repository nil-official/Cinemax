import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle as GoogleIcon } from "react-icons/fc";
import { Button, Typography } from '@mui/material';
import { googleAuth } from '../../store/actions/auth';
import { useDispatch } from 'react-redux';

const GoogleLogin = () => {

    const dispatch = useDispatch();

    const googleLogin = async (authResult) => {
        try {
            dispatch(googleAuth(authResult));
        } catch (error) {
            console.log('Google Login Error:', error.message);
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: googleLogin,
        onError: googleLogin,
        flow: 'auth-code',
    });

    return (
        <Button
            variant="outlined"
            color="secondary"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                color: "#fff",
                borderColor: "#fff",
                borderRadius: "8px",
                padding: "10px",
                "&:hover": {
                    borderColor: "#fff",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
            }}
            onClick={handleGoogleLogin}
        >
            <GoogleIcon style={{ fontSize: "24px" }} />
            <Typography>Continue with Google</Typography>
        </Button>
    )
}

export default GoogleLogin