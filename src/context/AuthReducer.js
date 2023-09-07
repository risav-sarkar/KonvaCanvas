const AuthReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_USER_START":
      return {
        ...state,
        token: null,
        profile: null,
        error: false,
        isFetching: true,
      };
    case "FETCH_USER_SUCCESS":
      return {
        ...state,
        isFetching: false,
        token: action.payload.token,
        profile: action.payload.profile,
        error: false,
      };
    case "FETCH_USER_FAILURE":
      return {
        ...state,
        token: null,
        profile: null,
        isFetching: false,
        error: action.payload,
      };
    case "LOGIN_USER_START":
      return {
        ...state,
        token: null,
        profile: null,
        error: false,
        isFetching: true,
      };
    case "LOGIN_USER_SUCCESS":
      return {
        ...state,
        isFetching: false,
        profile: action.payload.profile,
        token: action.payload.token,
        error: false,
      };
    case "LOGIN_USER_FAILURE":
      return {
        ...state,
        token: null,
        profile: null,
        isFetching: false,
        error: action.payload,
      };
    case "USER_SIGNOUT":
      return {
        ...state,
        token: null,
        profile: null,
        isFetching: false,
        error: null,
      };
    case "SET_PROFILE":
      return {
        ...state,
        profile: action.payload,
      };
    case "SET_TOKEN":
      return {
        ...state,
        token: action.payload,
      };
    default:
      return state;
  }
};

export default AuthReducer;
