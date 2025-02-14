import React, { useState, useRef } from "react";
import jsQR from "jsqr";
import axios from "axios";
import toast from "react-hot-toast";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";

const TicketScanner = () => {
    const [imageSrc, setImageSrc] = useState(null);
    const fileInputRef = useRef(null);

    // Function to handle image upload and extract QR code
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            setImageSrc(e.target.result); // Set preview image
            const image = new Image();
            image.src = e.target.result;
            image.onload = () => {
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");

                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0, image.width, image.height);

                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

                if (qrCode) {
                    checkBooking(qrCode.data);
                } else {
                    toast.error("QR code not detected. Please try another image.");
                }
            };
        };
        reader.readAsDataURL(file);
    };

    // Function to send API request with the extracted booking ID
    const checkBooking = async (id) => {
        try {
            const response = await axios.get(`/bookings/check/${id}`);
            if (response.data.status === "success") {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to update booking. Try again.";
            toast.error(errorMessage);
        }
    };

    const handleScanQRCode = () => {
        toast.error("QR code scanning is not available right now.");
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Card sx={{ width: 400, p: 3, borderRadius: 3, boxShadow: 5 }}>
                <CardContent>
                    <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
                        Scan or Upload Ticket QR Code
                    </Typography>

                    <Button
                        variant="contained"
                        component="label"
                        fullWidth
                        sx={{ mb: 2, textTransform: "none" }}
                    >
                        Upload QR Code
                        <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                    </Button>

                    {imageSrc && (
                        <Box display="flex" justifyContent="center" mb={2}>
                            <img
                                src={imageSrc}
                                alt="Uploaded QR Code"
                                style={{ width: "100%", maxHeight: "200px", objectFit: "contain", borderRadius: "8px" }}
                            />
                        </Box>
                    )}

                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleScanQRCode}
                        sx={{
                            textTransform: "none",
                            "&:hover": { backgroundColor: "#e3f2fd" },
                        }}
                    >
                        Scan QR Code
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
};

export default TicketScanner;