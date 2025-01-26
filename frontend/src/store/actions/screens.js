import axios from "../../axiosConfig";
import {
    FETCH_SCREEN_PENDING,
    FETCH_SCREEN_FULFILLED,
    FETCH_SCREEN_REJECTED,
    RESET_SCREEN
} from '../types/screens';

// Action creators
export const resetScreen = () => ({
    type: RESET_SCREEN
})

// for internal use only
const fetchScreenPending = () => ({
    type: FETCH_SCREEN_PENDING,
});

const fetchScreenFulfilled = (screen) => ({
    type: FETCH_SCREEN_FULFILLED,
    payload: screen,
});

const fetchScreenRejected = (error) => ({
    type: FETCH_SCREEN_REJECTED,
    payload: error,
});

// Async action to fetch Screens
export const fetchScreen = (screenId) => {
    return async (dispatch) => {
        dispatch(fetchScreenPending());
        try {
            const response = await axios.get(`/screen/${screenId}`); 
            dispatch(fetchScreenFulfilled(response.data));
        } catch (error) {
            // uncomment to see the error response structure of axios
            // console.log(error);
            dispatch(fetchScreenRejected(error.message));
        }
    };
};