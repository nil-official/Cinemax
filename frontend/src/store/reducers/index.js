import { combineReducers } from 'redux';

import auth from './auth';
import movies from './movies';
import showtimes from './showtimes';
import screens from './screens';

export default combineReducers({
    authState: auth,
    movieState: movies,  
    showtimeState: showtimes,
    screenState: screens
})