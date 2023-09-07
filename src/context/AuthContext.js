import React, { createContext, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  token: null,
  profile: null,
  isFetching: false,
  error: false,
};

// const INITIAL_STATE = {
//   token: 11,
//   profile: null,
//   isFetching: false,
//   error: false,
// };

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        profile: state.profile,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
