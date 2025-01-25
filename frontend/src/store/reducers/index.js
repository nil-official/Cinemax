import { combineReducers } from 'redux';

import movies from './movies';
import showtimes from './showtimes';
import screens from './screens';

export default combineReducers({
    movieState: movies,  
    showtimeState: showtimes,
    screenState: screens

})