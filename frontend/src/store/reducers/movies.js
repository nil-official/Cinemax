import {
    SET_MOVIES,
    SELECT_MOVIE,
    SET_STATUS,
    FETCH_MOVIES_PENDING,
    FETCH_MOVIES_FULFILLED,
    FETCH_MOVIES_REJECTED
} from '../types/movies';

// Initial state
const initialState = {
    movies: [],
    selectedMovie: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

// Reducer
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_MOVIES:
            return { ...state, movies: action.payload };
        case SELECT_MOVIE:
            return { ...state, selectedMovie: action.payload };
        case SET_STATUS:
            return { ...state, status: action.payload };
        case FETCH_MOVIES_PENDING:
            return { ...state, status: 'loading' };
        case FETCH_MOVIES_FULFILLED:
            return { ...state, status: 'succeeded', movies: action.payload };
        case FETCH_MOVIES_REJECTED:
            return { ...state, status: 'failed', error: action.payload };
        default:
            return state;
    }
};

export default reducer;