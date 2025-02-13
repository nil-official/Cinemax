import {
    FETCH_SCREEN_PENDING,
    FETCH_SCREEN_FULFILLED,
    FETCH_SCREEN_REJECTED,
    RESET_SCREEN,
    SET_SELECTED_SEATS
} from '../types/screens';

// Initial state
const initialState = {
    screen: null,
    selectedSeats: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

// Reducer
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_SCREEN_PENDING:
            return { ...state, status: 'loading' };
        case FETCH_SCREEN_FULFILLED:
            return { ...state, status: 'succeeded', screen: action.payload };
        case FETCH_SCREEN_REJECTED:
            return { ...state, status: 'failed', error: action.payload };
        case RESET_SCREEN:
            return initialState;
        case SET_SELECTED_SEATS:
            return { ...state, selectedSeats: action.payload };
        default:
            return state;
    }
};

export default reducer;