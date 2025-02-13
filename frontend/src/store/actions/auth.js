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
export const login = (email, password) => async dispatch => {
  try {
    const response = await axios.post('/auth/login', { email, password });
    if (response.status === 200) {
      const userData = {
        user: response.data.data.user,
        token: response.data.token,
        expiresIn: response.data.expiresIn,
      }
      if (userData) {
        setUser(userData);
      }
      dispatch({ type: LOGIN_SUCCESS, payload: response.data, });
    }
  } catch (error) {
    dispatch({ type: LOGIN_FAIL });
  }
};

// Register user
export const register = ({ firstName, lastName, email, password }) => async (dispatch) => {
  try {
    const response = await axios.post('/auth/register', {
      firstName,
      lastName,
      email,
      password,
    });
    if (response.status === 201) {
      const userData = {
        user: response.data.data.user,
        token: response.data.token,
        expiresIn: response.data.expiresIn,
      }
      if (userData) {
        setUser(userData);
      }
      dispatch({ type: REGISTER_SUCCESS, payload: response.data, });
    }
  } catch (error) {
    dispatch({ type: REGISTER_FAIL });
  }
};

// Google authentication
export const googleAuth = (authResult) => async (dispatch) => {
  try {
    const { code } = authResult;
    const response = await axios.get(`/auth/google?code=${code}`);
    if (response.status === 200) {
      const userData = {
        user: response.data.data.user,
        token: response.data.token,
        expiresIn: response.data.expiresIn,
      }
      if (userData) {
        setUser(userData);
      }
      dispatch({ type: LOGIN_SUCCESS, payload: response.data, });
    }
  } catch (error) {
    dispatch({ type: LOGIN_FAIL });
  }
};

export const logout = () => async (dispatch) => {
  removeUser();
  dispatch({ type: LOGOUT });
};