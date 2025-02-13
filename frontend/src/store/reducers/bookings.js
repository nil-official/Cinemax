import {
    CREATE_BOOKING_PENDING,
    CREATE_BOOKING_FULFILLED,
    CREATE_BOOKING_REJECTED,
    FETCH_BOOKINGS_PENDING,
    FETCH_BOOKINGS_FULFILLED,
    FETCH_BOOKINGS_REJECTED,
} from '../types/bookings';

// Initial state
const initialState = {
    bookings: [],
    loading: false,
    error: null,
};

// Reducer
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_BOOKINGS_PENDING:
            return { ...state, loading: true };
        case FETCH_BOOKINGS_FULFILLED:
            return { ...state, loading: false, bookings: action.payload };
        case FETCH_BOOKINGS_REJECTED:
            return { ...state, loading: false, error: action.payload };
        case CREATE_BOOKING_PENDING:
            return { ...state, loading: true };
        case CREATE_BOOKING_FULFILLED:
            return { ...state, loading: false };
        case CREATE_BOOKING_REJECTED:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default reducer;