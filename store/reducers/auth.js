import { USER_LOGIN, USER_LOGOUT } from "../actions/auth";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  user: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload };
    case USER_LOGIN:
      return { ...state, user: action.payload };
    case USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
