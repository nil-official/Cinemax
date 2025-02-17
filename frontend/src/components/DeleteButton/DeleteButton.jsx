import { useState } from "react";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const DeleteButton = ({ onDelete, itemName = "this item" }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <IconButton
                color="error"
                onClick={() => setOpen(true)}
                aria-label="delete movie"
                size="small"
            >
                <Delete />
            </IconButton>

            <ConfirmDeleteModal
                open={open}
                onClose={() => setOpen(false)}
                message={`Are you sure you want to delete ${itemName}?`}
                onDelete={() => {
                    console.log("Delete button clicked");
                    onDelete();
                    setOpen(false);
                }}
            />
        </>
    );
};

export default DeleteButton;
