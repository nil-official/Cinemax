import axios from "../../axiosConfig";
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT
  } from '../types/auth';

import { setUser, removeUser, isLoggedIn } from '../../utils/auth';

  // Login user
  export const login = (username, password) => async dispatch => {
    try {
      const response = await axios.post('/login',{username, password});
      console.log(response);

      const responseData = await response.json();
      if (response.ok) {
        const { user } = responseData;
        user && setUser(user);
        dispatch({ type: LOGIN_SUCCESS, payload: responseData });
      }
      if (responseData.error) {
        dispatch({ type: LOGIN_FAIL });

      }
    } catch (error) {
      dispatch({ type: LOGIN_FAIL });

    }
  };