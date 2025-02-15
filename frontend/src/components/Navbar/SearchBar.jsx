import React, { useState } from "react";
import { TextField, IconButton, Box, Button } from "@mui/material";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");


  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
      <TextField
        autoFocus
        variant="outlined"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        sx={{
          flexGrow: 1, // Allow the TextField to grow and take available space
          bgcolor: "background.paper",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: 1,
        }}
      />
      <Button
        variant="contained"
        onClick={handleSearch}
        sx={{ ml: 1, height: "50px" }} // Add some margin to the left
      >
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;