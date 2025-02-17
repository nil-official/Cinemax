import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  TextField,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { Link } from "react-router-dom";
import axios from "../../../axiosConfig";
import PaginationComponent from "../../../components/PaginationComponent";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import DeleteButton from '../../../components/DeleteButton/DeleteButton';

const ShowtimesList = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchShowtimes();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchShowtimes = async () => {
    try {
      const response = await axios.get("/showtimes");
      // console.log(response)
      setShowtimes(response.data);
    } catch (error) {
      toast.error("Error fetching showtimes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/showtimes/${id}`);
      toast.success("Showtime deleted successfully");
      fetchShowtimes();
    } catch (error) {
      toast.error("Error deleting showtime");
    }
  };

  const filteredShowtimes = showtimes.filter((showtime) => {
    const movieTitle = showtime.movieId.title.toLowerCase();
    const screenName = showtime.screenId.name.toLowerCase();
    return (
      movieTitle.includes(searchTerm.toLowerCase()) ||
      screenName.includes(searchTerm.toLowerCase())
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentShowtimes = filteredShowtimes.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Manage Showtimes
        </Typography>
        <Button
          component={Link}
          to="/admin/showtimes/add"
          variant="contained"
          startIcon={<Add />}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
          }}
        >
          Add Showtime
        </Button>
      </Box>

      <TextField
        variant="outlined"
        placeholder="Search by movie or screen name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3, width: "100%" }}
      />

      <TableContainer
        component={Paper}
        sx={{ backgroundColor: "transparent", boxShadow: "none" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  backgroundColor: "#90caf9",
                  color: "black",
                }}
              >
                Movie
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  backgroundColor: "#90caf9",
                  color: "black",
                }}
              >
                Screen
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  backgroundColor: "#90caf9",
                  color: "black",
                }}
              >
                Date
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  backgroundColor: "#90caf9",
                  color: "black",
                }}
              >
                Start Time
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  backgroundColor: "#90caf9",
                  color: "black",
                }}
              >
                End Time
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  backgroundColor: "#90caf9",
                  color: "black",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentShowtimes.map((showtime) => (
              <TableRow key={showtime._id} hover>
                <TableCell sx={{ fontSize: "1rem" }}>
                  {showtime.movieId.title}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "1rem" }}>
                  {showtime.screenId.name}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "1rem" }}>
                  {format(new Date(showtime.date), "dd/MM/yyyy")}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "1rem" }}>
                  {format(new Date(showtime.startAt), "hh:mm a")}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "1rem" }}>
                  {format(new Date(showtime.endAt), "hh:mm a")}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    component={Link}
                    to={`/admin/showtimes/edit/${showtime._id}`}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  {/* <IconButton
                    color="error"
                    onClick={() => {
                      handleDelete(showtime._id);
                    }}
                  >
                    <Delete />
                  </IconButton> */}
                  <DeleteButton onDelete={() => handleDelete(showtime._id)} />
                </TableCell>
              </TableRow>
            ))}
            {filteredShowtimes.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No showtimes found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {filteredShowtimes.length > 0 && (
        <PaginationComponent
          totalItems={filteredShowtimes.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </Box>
  );
};

export default ShowtimesList;