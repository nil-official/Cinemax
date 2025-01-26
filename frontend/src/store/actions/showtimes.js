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
export const selectShowtime = (showtime) => ({
    type: SELECT_SHOWTIME,
    payload: showtime,
});

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
            const response = await axios.get(`/showtime/${movieId}`); 
            dispatch(fetchShowtimesFulfilled(response.data));
        } catch (error) {
            // uncomment to see the error response structure of axios
            // console.log(error);
            dispatch(fetchShowtimesRejected(error.message));
        }
    };
};