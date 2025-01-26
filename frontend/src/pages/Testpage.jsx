import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { selectMovie, fetchMovies } from '../store/actions/movies';
import { useNavigate } from 'react-router-dom';

const Testpage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { movies, selectedMovie, status, error } = useSelector((state) => state.movieState);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchMovies());
        }
    }, [status, dispatch]);

    const handleMovieSelect = (movie) => {
        dispatch(selectMovie(movie));
    }

    return (
        <div>
            {status === 'loading' && <p>Loading...</p>}
            {movies.map((movie) => (
                <div key={movie._id} onClick={() => handleMovieSelect(movie)}>
                    <h2>{movie.title}</h2>
                    <p>{movie.year}</p>
                </div>
            )
            )}
            <div>Status: {status}</div>
            <button onClick={() => navigate('/')}>Home</button>
        </div>
    )
}

export default Testpage