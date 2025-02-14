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
  const [formData, setFormData] = useState({
    movieId: '',
    screenId: '',
    date: new Date().toLocaleDateString('en-ca'),
    startAt: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    endAt: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  });
  
  const [movies, setMovies] = useState([]);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

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
      setScreens(screensRes.data);
    } catch (error) {
      console.log(error);
      toast.error('Error fetching data');
    }
  };

  const fetchShowtime = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/showtimes/id/${id}`);
      const showtime = response.data;
  
      if (showtime) {
        const date = new Date(showtime.date);
        const startAt = new Date(showtime.startAt);
        const endAt = new Date(showtime.endAt);
  
        // Check if the dates are valid
        if (isNaN(date) || isNaN(startAt) || isNaN(endAt)) {
          throw new Error('Invalid date values');
        }
  
        setFormData({
          movieId: showtime.movieId ? showtime.movieId._id : '',
          screenId: showtime.screenId ? showtime.screenId._id : '',
          date: format(date, 'yyyy-MM-dd'),
          startAt: format(startAt, 'HH:mm'),
          endAt: format(endAt, 'HH:mm')
        });
      } else {
        toast.error('Showtime not found');
        navigate('/admin/showtimes');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error fetching showtime');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.movieId || !formData.screenId || !formData.date || 
        !formData.startAt || !formData.endAt) {
      toast.error('All fields are required');
      return false;
    }

    const startTime = new Date(`${formData.date}T${formData.startAt}`);
    const endTime = new Date(`${formData.date}T${formData.endAt}`);
    if (endTime <= startTime) {
      toast.error('End time must be after start time');
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
        date: formData.date,
        startAt: `${formData.date}T${formData.startAt}`,
        endAt: `${formData.date}T${formData.endAt}`
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
      toast.error(error.response?.data?.message || 'Error saving showtime');
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
    <Box sx={{ p: 3}}>
      <Typography variant="h4" sx={{ mb: 4,  display: "flex", justifyContent: "center", alignItems: "center" }}>
        {id ? 'Edit Showtime' : 'Add New Showtime'}
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Movie</InputLabel>
            <Select
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
            <InputLabel>Screen</InputLabel>
            <Select
              name="screenId"
              value={formData.screenId}
              onChange={handleChange}
              required
            >
              {screens.map((screen) => (
                <MenuItem key={screen._id} value={screen._id}>
                  {screen.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            required
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Start Time"
              type="time"
              name="startAt"
              value={formData.startAt}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              label="End Time"
              type="time"
              name="endAt"
              value={formData.endAt}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Box>

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