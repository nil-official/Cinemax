import axios from "../../axiosConfig";
import {
    SET_SHOWTIMES,
    SELECT_SHOWTIME,
    FETCH_SHOWTIMES_PENDING,
    FETCH_SHOWTIMES_FULFILLED,
    FETCH_SHOWTIMES_REJECTED,
    RESET_SHOWTIMES
} from '../types/showtimes';

// Action creators
// export const selectShowtime = (showtime) => ({
//     type: SELECT_SHOWTIME,
//     payload: showtime,
// });
export const selectShowtime = (showtime) => (dispatch) => {
    return new Promise((resolve) => {
        dispatch({ type: SELECT_SHOWTIME, payload: showtime });
        resolve(); // Ensure dispatch completes before resolving
    });
};

export const resetShowtimes = () => ({
    type: RESET_SHOWTIMES
})

// for internal use only

const fetchShowtimesPending = () => ({
    type: FETCH_SHOWTIMES_PENDING,
});

const fetchShowtimesFulfilled = (showtimes) => ({
    type: FETCH_SHOWTIMES_FULFILLED,
    payload: showtimes,
});

const fetchShowtimesRejected = (error) => ({
    type: FETCH_SHOWTIMES_REJECTED,
    payload: error,
});

// Async action to fetch showtimes
export const fetchShowtimes = (movieId) => {
    return async (dispatch) => {
        dispatch(fetchShowtimesPending());
        try {
            const response = await axios.get(`/showtimes/movie/${movieId}`);
            dispatch(fetchShowtimesFulfilled(response.data.showtimes));
        } catch (error) {
            dispatch(fetchShowtimesRejected(error.message));
        }
    };
};

// Async action to fetch showtime by id
export const fetchShowtimeById = (showtimeId) => {
    return async (dispatch) => {
        dispatch(fetchShowtimesPending());
        try {
            const response = await axios.get(`/showtimes/${showtimeId}`);
            dispatch(selectShowtime(response.data.showtime));
        } catch (error) {
            dispatch(fetchShowtimesRejected(error.message));
        }
    };
};