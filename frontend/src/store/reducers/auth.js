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

const initialState = {
  loading: false,
  user: null,
  isAuthenticated: false,
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        user: null,
        isAuthenticated: false,
        error: null
      };

    case LOAD_USER:
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.user,
        isAuthenticated: true,
        error: null
      };

    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        user: null,
        isAuthenticated: false,
        error: action.error
      };

    case LOGOUT:
      return {
        ...state,
        loading: false,
        user: null,
        isAuthenticated: false,
        error: null
      };

    default:
      return state ?? initialState;
  }
};