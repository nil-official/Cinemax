import axios from "../../axiosConfig";
import {
    SET_MOVIES,
    SELECT_MOVIE,
    FETCH_MOVIES_PENDING,
    FETCH_MOVIES_FULFILLED,
    FETCH_MOVIES_REJECTED,
} from '../types/movies';

// Action creators
export const setMovies = (movies) => ({
    type: SET_MOVIES,
    payload: movies,
});

export const selectMovie = (movie) => ({
    type: SELECT_MOVIE,
    payload: movie,
});

// for internal use only

const fetchMoviesPending = () => ({
    type: FETCH_MOVIES_PENDING,
});

const fetchMoviesFulfilled = (movies) => ({
    type: FETCH_MOVIES_FULFILLED,
    payload: movies,
});

const fetchMoviesRejected = (error) => ({
    type: FETCH_MOVIES_REJECTED,
    payload: error,
});

// Async action to fetch movies
export const fetchMovies = () => {
    return async (dispatch) => {
        dispatch(fetchMoviesPending());
        try {
            const response = await axios.get('/movies'); 
            dispatch(fetchMoviesFulfilled(response.data));
        } catch (error) {
            // uncomment to see the error response structure of axios
            // console.log(error);
            dispatch(fetchMoviesRejected(error.message));
        }
    };
};