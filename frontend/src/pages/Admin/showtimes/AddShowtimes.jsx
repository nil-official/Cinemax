import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  CircularProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../../axiosConfig';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const AddShowtimes = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedScreenTimes, setSelectedScreenTimes] = useState([]);

  const [formData, setFormData] = useState({
    movieId: '',
    screenId: '',
    timeSlot: '',
    date: ''
  });

  useEffect(() => {
    fetchMoviesAndScreens();
    if (id) {
      fetchShowtime();
    }
  }, [id]);

  const fetchMoviesAndScreens = async () => {
    try {
      const [moviesRes, screensRes] = await Promise.all([
        axios.get('/movies'),
        axios.get('/screens')
      ]);
      setMovies(moviesRes.data);
      setScreens(screensRes.data.screens);
    } catch (error) {
      toast.error('Error fetching data');
    }
  };

  const fetchShowtime = async () => {
    try {
      setLoading(true);

      // Fetch showtime
      const showtimesRes = await axios.get(`/showtimes/${id}`);
      const showtime = showtimesRes.data.showtime;

      // Fetch screens
      const screensRes = await axios.get('/screens');
      const screens = screensRes.data.screens;

      if (showtime) {
        // Checking if the date is valid
        const date = new Date(showtime.date);
        if (isNaN(date)) {
          throw new Error('Invalid date values');
        }

        // Find the selected screen and set its time slots
        const selectedScreen = screens.find(screen => screen._id === showtime.screenId._id);
        setSelectedScreenTimes(selectedScreen.timeSlots);

        // Set formData after selectedScreenTimeSlots is populated
        setFormData({
          movieId: showtime.movieId ? showtime.movieId._id : '',
          screenId: showtime.screenId ? showtime.screenId._id : '',
          timeSlot: showtime.timeSlot ? showtime.timeSlot : '',
          date: format(date, 'yyyy-MM-dd')
        });
      } else {
        toast.error('Showtime not found');
        navigate('/admin/showtimes');
      }
    } catch (error) {
      toast.error('Error fetching showtime');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Find the selected screen and set its time slots
    if (name === 'screenId') {
      const selectedScreen = screens.find(screen => screen._id === value);
      setSelectedScreenTimes(selectedScreen ? selectedScreen.timeSlots : []);
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.movieId || !formData.screenId || !formData.timeSlot || !formData.date) {
      toast.error('All fields are required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const data = {
        movieId: formData.movieId,
        screenId: formData.screenId,
        timeSlot: formData.timeSlot,
        date: formData.date
      };

      if (id) {
        await axios.put(`/showtimes/${id}`, data);
        toast.success('Showtime updated successfully');
      } else {
        await axios.post('/showtimes', data);
        toast.success('Showtime created successfully');
      }
      navigate('/admin/showtimes');
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error('The selected time slot is already occupied for this date.');
      } else {
        toast.error(error.response?.data?.message || 'Error saving showtime.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, display: "flex", justifyContent: "center", alignItems: "center" }}>
        {id ? 'Edit Showtime' : 'Add New Showtime'}
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Movie *</InputLabel>
            <Select
              label="Movie"
              name="movieId"
              value={formData.movieId}
              onChange={handleChange}
              required
            >
              {movies.map((movie) => (
                <MenuItem key={movie._id} value={movie._id}>
                  {movie.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Screen *</InputLabel>
            <Select
              label="Screen"
              name="screenId"
              value={formData.screenId}
              onChange={handleChange}
              disabled={!formData.movieId}
              required
            >
              {screens.map((screen) => (
                <MenuItem key={screen._id} value={screen._id}>
                  {screen.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Time Slot *</InputLabel>
            <Select
              label="Time Slot"
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleChange}
              disabled={!formData.screenId}
              required
            >
              {selectedScreenTimes.map((timeSlot, index) => (
                <MenuItem key={index} value={timeSlot}>
                  {timeSlot}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label="Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: new Date().toISOString().split('T')[0],
                max: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              }}
              disabled={!formData.timeSlot}
              required
            />
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/admin/showtimes')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Saving...' : id ? 'Update Showtime' : 'Add Showtime'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddShowtimes;