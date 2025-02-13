import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from '../types/auth';

const initialState = {
  token: localStorage.getItem('user')?.token,
  isAuthenticated: null,
  loading: true,
  user: null,
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return { ...state, user: payload, isAuthenticated: true, loading: false };
    case REGISTER_SUCCESS:
      return { ...state, ...payload, user: payload.data.user, isAuthenticated: true, loading: false };
    case LOGIN_SUCCESS:
      return { ...state, ...payload, user: payload.data.user, isAuthenticated: true, loading: false };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case AUTH_ERROR:
    case LOGOUT:
      localStorage.removeItem('code');
      return { ...state, token: null, isAuthenticated: false, loading: false, user: null };
    default:
      return state;
  }
};
