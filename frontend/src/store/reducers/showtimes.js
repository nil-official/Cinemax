import {
    SELECT_SHOWTIME,
    FETCH_SHOWTIMES_PENDING,
    FETCH_SHOWTIMES_FULFILLED,
    FETCH_SHOWTIMES_REJECTED,
    RESET_SHOWTIMES
} from '../types/showtimes';

// Initial state
const initialState = {
    showtimes: [],
    selectedShowtime: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

// Reducer
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SELECT_SHOWTIME:
            return { ...state, selectedShowtime: action.payload };
        case FETCH_SHOWTIMES_PENDING:
            return { ...state, status: 'loading' };
        case FETCH_SHOWTIMES_FULFILLED:
            return { ...state, status: 'succeeded', showtimes: action.payload };
        case FETCH_SHOWTIMES_REJECTED:
            return { ...state, status: 'failed', error: action.payload };
        case RESET_SHOWTIMES:
            return initialState;
        default:
            return state;
    }
};

export default reducer;