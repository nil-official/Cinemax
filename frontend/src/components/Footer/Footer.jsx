import React from "react";
import { Box, Typography, Container, Grid, Link } from "@mui/material";
import { useTheme } from "@mui/material";

const Footer = () => {
    const theme = useTheme();
    return (
        <Box
            sx={{
                width: "100%",
                backgroundColor: theme.palette.background.paper,
                color: "white",
                padding: "24px 0",
                marginTop: "auto",
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Company Info */}
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Cinemax
                        </Typography>
                        <Typography variant="body2" sx={{ marginTop: "8px", opacity: 0.7 }}>
                            Your ultimate destination for booking tickets.
                        </Typography>
                    </Grid>

                    {/* Quick Links */}
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Quick Links
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", marginTop: "8px" }}>
                            <Link href="/" color="inherit" underline="none" sx={{ opacity: 0.8, "&:hover": { opacity: 1 } }}>
                                Home
                            </Link>
                            {/* <Link href="/movies" color="inherit" underline="none" sx={{ opacity: 0.8, "&:hover": { opacity: 1 } }}>
                                Movies
                            </Link> */}
                            <Link href="/bookings" color="inherit" underline="none" sx={{ opacity: 0.8, "&:hover": { opacity: 1 } }}>
                                My Bookings
                            </Link>
                            {/* <Link href="/contact" color="inherit" underline="none" sx={{ opacity: 0.8, "&:hover": { opacity: 1 } }}>
                                Contact Us
                            </Link> */}
                        </Box>
                    </Grid>

                    {/* Contact */}
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Contact
                        </Typography>
                        <Typography variant="body2" sx={{ marginTop: "8px", opacity: 0.7 }}>
                            Email: support@cinemax.com
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                            Phone: +91 6289851463
                        </Typography>
                    </Grid>
                </Grid>

                {/* Copyright */}
                <Box sx={{ textAlign: "center", marginTop: "16px", opacity: 0.7 }}>
                    <Typography variant="body2">
                        &copy; {new Date().getFullYear()} Cinemax. All Rights Reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
