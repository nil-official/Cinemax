import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectMovie, fetchMovies } from '../store/actions/movies';
import { Button } from '@mui/material';

const Moviepage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { movieId } = useParams();

    const { movies, selectedMovie, status, error } = useSelector((state) => state.movieState);

    // When page is refreshed, fetch movies from the server
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchMovies());
        }
    }, [status, dispatch]);

    // When movies are fetched, select the movie with the given movieId
    useEffect(() => {
        if (!selectedMovie && status === 'succeeded' && movieId) {
            const movie = movies.find((movie) => movie._id === movieId);
            if (movie) {
                dispatch(selectMovie(movie));
            }
        }
    }, [status, movieId, dispatch, movies]);

    return (
        <div>
            {status === 'loading' && <p>Loading...</p>}
            <div>Status: {status}</div>
            {status === 'succeeded' && selectedMovie && (
                <div>
                    <h1>{selectedMovie.title}</h1>
                    <p>{selectedMovie.description}</p>
                </div>
            )}
            {status === 'failed' && <p>{error}</p>}

            <Button>Get Showtimes</Button>
            <br />
            <button onClick={() => navigate('/')}>Home</button>
        </div>
    )
}

export default Moviepage