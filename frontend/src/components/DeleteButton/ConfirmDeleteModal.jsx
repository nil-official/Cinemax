import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const ConfirmDeleteModal = ({ open, onClose, message, onDelete }) => {
  return (
    <Modal open={open} onClose={() => {}} aria-labelledby="confirm-delete-modal">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" id="confirm-delete-modal">
          {message}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-around", mt: 3 }}>
          <Button variant="contained" color="error" onClick={onDelete}>
            Delete
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmDeleteModal;