import React, { useEffect, useState } from "react";
import axios from "../../../axiosConfig";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  styled,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import toast from "react-hot-toast";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  backgroundColor: "rgba(255, 251, 251, 0.04)",
  backdropFilter: "blur(10px)",
}));

const FlexContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

const AddMovie = () => {
  const initialState = {
    title: "",
    image: "",
    cover: "",
    language: "",
    genre: [],
    director: "",
    cast: "",
    description: "",
    duration: "",
    releaseDate: "",
    endDate: "",
  };

  const [movieData, setMovieData] = useState(initialState);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchMovieData();
    }
  }, [id]);

  const fetchMovieData = async () => {
    try {
      const response = await axios.get(`/movies/${id}`);
      const movie = response.data;
      setMovieData({
        ...movie,
        cast: Array.isArray(movie.cast) ? movie.cast.join(", ") : movie.cast,
        releaseDate: new Date(movie.releaseDate).toISOString().split("T")[0],
        endDate: new Date(movie.endDate).toISOString().split("T")[0],
      });
    } catch (error) {
      toast.error("Error fetching movie data");
    }
  };

  const validateDates = () => {
    const today = formatDate(new Date());
    const release = movieData.releaseDate;
    const end = movieData.endDate;

    if (!isValidDate(release)) {
      toast.error('Please enter a valid release date');
      return false;
    }

    if (!isValidDate(end)) {
      toast.error('Please enter a valid end date');
      return false;
    }

    if (release < today) {
      toast.error('Release date cannot be in the past');
      return false;
    }

    if (end <= release) {
      toast.error('End date must be after release date');
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovieData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenreChange = (event) => {
    const {
      target: { value },
    } = event;
    setMovieData({
      ...movieData,
      genre: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleSubmit = async (e) => {
    if (!validateDates()) return;
    e.preventDefault();
    try {
      const formattedData = {
        title: movieData.title,
        image: movieData.image,
        cover: movieData.cover,
        language: movieData.language,
        genre: movieData.genre,
        director: movieData.director,
        cast: movieData.cast.split(",").map((item) => item.trim()),
        description: movieData.description,
        duration: movieData.duration,
        releaseDate: movieData.releaseDate,
        endDate: movieData.endDate,
      };

      // console.log("Formatted Data:", formattedData); // Log the data being sent

      if (id) {
        await axios.put(`/movies/${id}`, formattedData);
        setMovieData(initialState);
        toast.success("Movie updated successfully");
      } else {
        await axios.post("/movies", formattedData);
        setMovieData(initialState);
        toast.success("Movie added successfully");
      }
      setTimeout(() => navigate("/admin/movies"), 1000);
    } catch (error) {
      console.error("Error:", error); // Log the error for debugging
      toast.error(error.response?.data?.error || "Error saving movie");
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4">
          {id ? "Edit Movie" : "Add New Movie"}
        </Typography>
      </Box>

      <StyledPaper elevation={3}>
        <form onSubmit={handleSubmit}>
          <FlexContainer>
            <TextField
              label="Title"
              name="title"
              value={movieData.title}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="Language"
              name="language"
              value={movieData.language}
              onChange={handleChange}
              fullWidth
              required
            />

            <Typography variant="h6" gutterBottom>
              Media URLs
            </Typography>
            <TextField
              label="Poster URL"
              name="image"
              value={movieData.image}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Cover URL"
              name="cover"
              value={movieData.cover}
              onChange={handleChange}
              fullWidth
              required
            />

            <Typography variant="h6" gutterBottom>
              Movie Details
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Genre</InputLabel>
              <Select
                multiple
                name="genre"
                value={movieData.genre}
                onChange={handleGenreChange}
                label="Genre"
                required
              >
                {[
                  "action",
                  "adventure",
                  "animation",
                  "comedy",
                  "crime",
                  "documentary",
                  "drama",
                  "fantasy",
                  "horror",
                  "mystery",
                  "romance",
                  "sci-fi",
                  "thriller",
                  "war",
                ].map((genre) => (
                  <MenuItem key={genre} value={genre}>
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Duration (minutes)"
              name="duration"
              type="number"
              value={movieData.duration}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Director"
              name="director"
              value={movieData.director}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Cast (comma separated)"
              name="cast"
              value={movieData.cast}
              onChange={handleChange}
              fullWidth
              required
              helperText="Enter cast names separated by commas"
            />
            <TextField
              label="Release Date"
              name="releaseDate"
              type="date"
              value={movieData.releaseDate}
              onChange={handleChange}
              fullWidth
              required
              slotProps={{
                inputLabel: {
                  shrink: true, // Control the shrink state here
                },
              }}
            />
            <TextField
              label="End Date"
              name="endDate"
              type="date"
              value={movieData.endDate}
              onChange={handleChange}
              fullWidth
              required
              slotProps={{
                inputLabel: {
                  shrink: true, // Control the shrink state here
                },
              }}
            />
            <TextField
              label="Description"
              name="description"
              value={movieData.description}
              onChange={handleChange}
              fullWidth
              required
              multiline
              rows={4}
            />
            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}
            >
              <Button variant="outlined" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {id ? "Update Movie" : "Add Movie"}
              </Button>
            </Box>
          </FlexContainer>
        </form>
      </StyledPaper>
    </Container>
  );
};

export default AddMovie;
