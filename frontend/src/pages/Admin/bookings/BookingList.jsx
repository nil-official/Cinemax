import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import axios from "../../../axiosConfig";
import PaginationComponent from "../../../components/PaginationComponent";
import { toast } from "react-hot-toast";
import { format, parse } from "date-fns";
import DeleteButton from "../../../components/DeleteButton/DeleteButton";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [movieFilter, setMovieFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchBookings();
  }, []);


  const fetchBookings = async () => {
    try {
      const response = await axios.get("/bookings/all");
      setBookings(response.data.data);
    } catch (error) {
      toast.error("Error fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await axios.put(`/bookings/${bookingId}`, { status: newStatus });
      toast.success("Booking status updated");
      fetchBookings();
    } catch (error) {
      toast.error("Error updating booking status");
    }
  };

  const handleDelete = async (bookingId) => {
    try {
      await axios.delete(`/bookings/${bookingId}`);
      toast.success("Booking deleted successfully");
      fetchBookings();
    } catch (error) {
      toast.error("Error deleting booking");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesMovie = booking.movie.title
      .toLowerCase()
      .includes(movieFilter.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    return matchesMovie && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
          Booking Management
        </Typography>
      </Box>

      <Box
        sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 3 }}
      >
        <TextField
          label="Search by Movie"
          variant="outlined"
          value={movieFilter}
          onChange={(e) => setMovieFilter(e.target.value)}
          sx={{ width: "100%" }}
        />
        <FormControl sx={{ width: "200px" }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="booked">Booked</MenuItem>
            <MenuItem value="checked">Checked</MenuItem>
            <MenuItem value="expired">Expired</MenuItem>
          </Select>
        </FormControl>
      </Box>

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
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  backgroundColor: "#90caf9",
                  color: "black",
                }}
              >
                Show Time
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  backgroundColor: "#90caf9",
                  color: "black",
                }}
              >
                Seats
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  backgroundColor: "#90caf9",
                  color: "black",
                }}
              >
                Total Price
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  backgroundColor: "#90caf9",
                  color: "black",
                }}
              >
                Status
              </TableCell>
              <TableCell
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
            {currentBookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>
                  {booking.movie.title}
                </TableCell>
                <TableCell>
                  {format(parse(booking.showtime.timeSlot, "HH:mm", new Date()), "hh:mm a")}
                </TableCell>
                <TableCell>
                  {booking.bookedSeats
                    .flatMap((rowData) =>
                      rowData.seats.map((seat) => `${rowData.row}${seat}`)
                    )
                    .join(", ")}
                </TableCell>
                <TableCell>
                  ₹{booking.totalPrice}
                </TableCell>
                <TableCell>
                  <FormControl size="small">
                    <Select
                      value={booking.status}
                      onChange={(e) =>
                        handleStatusChange(booking._id, e.target.value)
                      }
                    >
                      <MenuItem value="booked">Booked</MenuItem>
                      <MenuItem value="checked">Checked</MenuItem>
                      <MenuItem value="expired">Expired</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <DeleteButton onDelete={() => handleDelete(booking._id)} />
                </TableCell>
              </TableRow>
            ))}
            {currentBookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No Bookings found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationComponent
        totalItems={filteredBookings.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </Box>
  );
};

export default BookingList;