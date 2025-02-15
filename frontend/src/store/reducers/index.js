import { combineReducers } from 'redux';

import auth from './auth';
import movies from './movies';
import showtimes from './showtimes';
import screens from './screens';
import bookings from './bookings';

export default combineReducers({
    authState: auth,
    movieState: movies,
    showtimeState: showtimes,
    screenState: screens,
    bookingState: bookings,
})