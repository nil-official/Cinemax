import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../axiosConfig";
import { Box, Typography, Button, Grid, TextField } from "@mui/material";
import { toast } from "react-hot-toast";

const AddScreen = () => {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [layouts, setLayouts] = useState([]);
  const [screenName, setScreenName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchScreenData();
    }
  }, [id]);

  const fetchScreenData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/screens/${id}`);
      const { name, layout } = response.data;
      setScreenName(name);
      setLayouts(layout);
    } catch (error) {
      toast.error("Error fetching screen data");
    } finally {
      setLoading(false);
    }
  };

  const handleSetLayout = () => {
    // If no layouts exist, start with "A" as the first row label
    const existingRows = layouts.flatMap((layout) =>
      layout.rows.map((row) => row.row)
    );
    const lastRowLabel =
      existingRows.length > 0 ? existingRows[existingRows.length - 1] : "A";
    const nextRowLabel =
      lastRowLabel === "A"
        ? "A"
        : String.fromCharCode(lastRowLabel.charCodeAt(0) + 1);

    const newLayout = {
      category: category,
      price: price,
      rows: Array.from({ length: rows }, (_, rowIndex) => ({
        row: String.fromCharCode(nextRowLabel.charCodeAt(0) + rowIndex),
        seats: Array.from({ length: cols }, (_, i) => i + 1),
      })),
    };

    setLayouts([...layouts, newLayout]);
    setCategory("");
    setPrice(0);
    setRows(5);
    setCols(5);
  };

  // const handleAddRow = (layoutIndex) => {
  //   const updatedLayouts = [...layouts];
  //   if (updatedLayouts[layoutIndex].rows.length < 26) {
  //     updatedLayouts[layoutIndex].rows.push({
  //       row: String.fromCharCode(65 + updatedLayouts[layoutIndex].rows.length),
  //       seats: Array.from({ length: cols }, (_, i) => i + 1),
  //     });
  //     setLayouts(updatedLayouts);
  //   }
  // };

  const handleDeleteRow = (layoutIndex, rowIndex) => {
    const updatedLayouts = [...layouts];
    updatedLayouts[layoutIndex].rows.splice(rowIndex, 1);
    setLayouts(updatedLayouts);
  };

  const handleAddColumn = (layoutIndex) => {
    const updatedLayouts = [...layouts];
    updatedLayouts[layoutIndex].rows = updatedLayouts[layoutIndex].rows.map(
      (row) => {
        const lastSeatNumber = row.seats[row.seats.length - 1];
        return {
          ...row,
          seats: [...row.seats, lastSeatNumber + 1], // Add the next seat number
        };
      }
    );
    setLayouts(updatedLayouts);
  };

  const handleAddGap = (layoutIndex) => {
    const updatedLayouts = [...layouts];
    updatedLayouts[layoutIndex].rows = updatedLayouts[layoutIndex].rows.map(
      (row) => {
        const lastSeatNumber = row.seats[row.seats.length - 1];
        return {
          ...row,
          seats: [...row.seats, null, lastSeatNumber + 1], // Add a null value for the gap and the next seat number
        };
      }
    );
    setLayouts(updatedLayouts);
  };

  const handleDeleteColumn = (layoutIndex) => {
    const updatedLayouts = [...layouts];
    updatedLayouts[layoutIndex].rows = updatedLayouts[layoutIndex].rows.map(
      (row) => ({
        ...row,
        seats: row.seats.slice(0, -1),
      })
    );
    setLayouts(updatedLayouts);
  };

  const handleDeleteLayout = (layoutIndex) => {
    const updatedLayouts = [...layouts];
    updatedLayouts.splice(layoutIndex, 1);
    setLayouts(updatedLayouts);
  };

  const handleSave = async () => {
    if (!screenName.trim()) {
      toast.error("Screen name is required");
      return;
    }
  
    if (layouts.length === 0) {
      toast.error("At least one layout is required");
      return;
    }
  
    const screenData = {
      name: screenName,
      layout: layouts.map((layout) => ({
        category: layout.category,
        price: Number(layout.price),
        rows: layout.rows.map((row) => ({
          row: row.row,
          seats: row.seats, // Keep null values in the seats array
        })),
      })),
    };
  
    try {
      console.log(screenData);
      setLoading(true);
  
      // Optional: Add validation here
      if (!screenName || !layouts.length) {
        throw new Error("Screen name and layouts are required.");
      }
  
      if (id) {
        await axios.put(`/screens/${id}`, screenData);
        toast.success("Screen updated successfully");
      } else {
        await axios.post("/screens", screenData);
        console.log("Screen Data:", screenData);
        toast.success("Screen created successfully");
      }
  
      navigate("/admin/screens");
    } catch (error) {
      console.error("Error saving screen:", error); // Log the error for debugging
      toast.error(error.response?.data?.message || "Error saving screen");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box
      sx={{
        p: 2,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
        {id ? "Edit Screen" : "Admin Seat Layout Editor"}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}>
        <TextField
          label="Screen Name"
          value={screenName}
          onChange={(e) => setScreenName(e.target.value)}
          sx={{ mb: 3, width:"15%"}}
          required
        />
        <TextField
          label="Rows"
          type="text"
          value={rows}
          onChange={(e) => setRows(Number(e.target.value))}
          sx={{ width: 80 }}
          required
        />
        <TextField
          label="Columns"
          type="text"
          value={cols}
          onChange={(e) => setCols(Number(e.target.value))}
          sx={{ width: 80 }}
          required
        />
        <TextField
          label="Category"
          value={category}
          sx={{width:"15%"}}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <TextField
          label="Price"
          type="text"
          value={price}
          sx={{width:80}}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
        />
        <Button variant="contained" onClick={handleSetLayout}
          sx={{
            height:55
          }}
        >
          Add Layout
        </Button>
      </Box>
      {layouts.map((layout, layoutIndex) => (
        <Box
          key={layoutIndex}
          sx={{ mb: 3, border: "1px solid #ccc", p: 2, borderRadius: 1 }}
        >
          <Typography variant="h6">
            {layout.category} - Rs. {layout.price}
          </Typography>
          {layout.rows.map((row, rowIndex) => (
            <Grid key={rowIndex} container alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="body1" sx={{ width: 24, mr: 2 }}>
                {row.row}
              </Typography>
              {row.seats.map((seat, seatIndex) => (
                <Button
                  key={seatIndex}
                  variant="outlined"
                  size="small"
                  sx={{
                    margin: "5px",
                    minWidth: 32,
                    backgroundColor:
                      seat === null || seat === "Gap" ? "transparent" : "none",
                    borderColor:
                      seat === null || seat === "Gap" ? "transparent" : "none",
                    color:
                      seat === null || seat === "Gap" ? "transparent" : "none", // Optional: if you want to change the text color as well
                  }}
                >
                  {seat !== null ? seat : "Gap"}
                </Button>
              ))}
              <Button
                color="error"
                onClick={() => handleDeleteRow(layoutIndex, rowIndex)}
              >
                X
              </Button>
            </Grid>
          ))}
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}
          >
            <Button
              variant="contained"
              onClick={() => handleAddColumn(layoutIndex)}
            >
              Add Column
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDeleteColumn(layoutIndex)}
            >
              Delete Column
            </Button>
            <Button
              variant="contained"
              onClick={() => handleAddGap(layoutIndex)}
            >
              Add Gap
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDeleteLayout(layoutIndex)}
              sx={{ minWidth: "auto" }}
            >
              Remove Layout
            </Button>
          </Box>
        </Box>
      ))}
     <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate("/admin/screens")}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="success"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : id ? "Update Screen" : "Save Screen"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddScreen;
