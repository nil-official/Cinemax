import { useParams } from "react-router-dom";
import MovieCard from "../components/MovieCarousel/MovieCarouselCard";
import { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { useTheme } from "@mui/material/styles";

const SearchResults = () => {
    const { query } = useParams();
    const [movies, setMovies] = useState([]);
    const theme = useTheme();
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(`/movies/search/q?q=${query}`);
                setMovies(response.data);
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };

        fetchMovies();
    }, [query]);

    return (
        <div style={{ marginBottom: '40px' }}>
            <h1>Search Results</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {movies.length > 0 ? (
                    movies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} theme={theme} />
                    ))
                ) : (
                    <p>No results found.</p>
                )}
            </div>
        </div>
    );
};

export default SearchResults;