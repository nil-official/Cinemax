import axios from "../../axiosConfig";
import {
  LOAD_USER,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from '../types/auth';
import { getUser, saveUser, removeUser } from '../../utils/auth';

export const loadUser = () => dispatch => {
  const userInfo = getUser();
  if (userInfo?.user) {
    dispatch({ type: LOAD_USER, user: userInfo.user });
  }
};

export const register = ({ firstName, lastName, email, password }) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const res = await axios.post('/auth/register', { firstName, lastName, email, password });
    if (res.status === 201) {
      saveUser(res.data);
      dispatch({ type: REGISTER_SUCCESS, user: res.data.data.user });
    }
  } catch (error) {
    dispatch({ type: REGISTER_FAILURE, error: error.response.data.error || "Registration failed. Please try again" });
  }
};

export const login = ({ email, password }) => async dispatch => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const res = await axios.post('/auth/login', { email, password });
    if (res.status === 200) {
      saveUser(res.data);
      dispatch({ type: LOGIN_SUCCESS, user: res.data.data.user });
    }
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, error: error.response.data.error || "Login failed. Please try again" });
  }
};

export const googleAuth = (authResult) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const { code } = authResult;
    const res = await axios.get(`/auth/google?code=${code}`);
    if (res.status === 200) {
      saveUser(res.data);
      dispatch({ type: LOGIN_SUCCESS, user: res.data.data.user });
    }
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, error: error.response.data.error || "Login failed. Please try again" });
  }
};

export const logout = () => async (dispatch) => {
  removeUser();
  dispatch({ type: LOGOUT });
};