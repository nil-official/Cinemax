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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "../../../axiosConfig";
import PaginationComponent from "../../../components/PaginationComponent";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { useSearchParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [movieFilter, setMovieFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Default to today's date
  const today = dayjs().format("YYYY-MM-DD");
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || today);
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || today);

  useEffect(() => {
    fetchBookings();
  }, []); // Fetch only on mount, not on input change

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/bookings/dateRange?startDate=${startDate}&endDate=${endDate}`);
      setBookings(response.data.data.bookings);
    } catch (error) {
      toast.error("Error fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    // Update URL params
    const newParams = new URLSearchParams();
    newParams.set("startDate", startDate);
    newParams.set("endDate", endDate);
    navigate(`?${newParams.toString()}`);
    fetchBookings(); // Fetch only when "Apply" is clicked
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesMovie = booking.movie.title.toLowerCase().includes(movieFilter.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchesMovie && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" mb={3}>
          Booking Management
        </Typography>

        {/* Filters */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            label="Search by Movie"
            variant="outlined"
            value={movieFilter}
            onChange={(e) => setMovieFilter(e.target.value)}
            sx={{ flex: 1 }}
          />
          <FormControl sx={{ width: "200px" }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="booked">Booked</MenuItem>
              <MenuItem value="checked">Checked</MenuItem>
              <MenuItem value="expired">Expired</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Date Filters */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <DesktopDatePicker
            label="Start Date"
            inputFormat="YYYY-MM-DD"
            value={dayjs(startDate)}
            onChange={(newValue) => setStartDate(newValue.format("YYYY-MM-DD"))}
            renderInput={(params) => <TextField {...params} />}
          />
          <DesktopDatePicker
            label="End Date"
            inputFormat="YYYY-MM-DD"
            value={dayjs(endDate)}
            onChange={(newValue) => setEndDate(newValue.format("YYYY-MM-DD"))}
            renderInput={(params) => <TextField {...params} />}
          />
          <Button variant="contained" onClick={applyFilters}>Apply</Button>
        </Box>

        {/* Table */}
        <TableContainer component={Paper} sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: "1.25rem", fontWeight: "bold", backgroundColor: "#90caf9" }}>Movie</TableCell>
                <TableCell sx={{ fontSize: "1.25rem", fontWeight: "bold", backgroundColor: "#90caf9" }}>Show Time</TableCell>
                <TableCell sx={{ fontSize: "1.25rem", fontWeight: "bold", backgroundColor: "#90caf9" }}>Seats</TableCell>
                <TableCell sx={{ fontSize: "1.25rem", fontWeight: "bold", backgroundColor: "#90caf9" }}>Total Price</TableCell>
                <TableCell sx={{ fontSize: "1.25rem", fontWeight: "bold", backgroundColor: "#90caf9" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentBookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>{booking.movie.title}</TableCell>
                  <TableCell>{format(new Date(booking.showtime.startAt), "dd/MM/yyyy hh:mm a")}</TableCell>
                  <TableCell>{booking.bookedSeats.flatMap((rowData) => rowData.seats.map((seat) => `${rowData.row}${seat}`)).join(", ")}</TableCell>
                  <TableCell>₹{booking.totalPrice}</TableCell>
                  <TableCell>
                    <FormControl size="small">
                      <Select value={booking.status}>
                        <MenuItem value="booked">Booked</MenuItem>
                        <MenuItem value="checked">Checked</MenuItem>
                        <MenuItem value="expired">Expired</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
              {currentBookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
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
    </LocalizationProvider>
  );
};

export default BookingList;
