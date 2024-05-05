import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  values: {
    isAuth: false,
    userId: null,
    token: null,
    isCoordinator: false,
    isAssitant: false,
  },
};

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: () => {
      localStorage.removeItem("authData");
      return initialState;
    },

    logIn: (state, action) => {
      const { token, userId, expirationTime, isCoordinator, isAssitant } =
        action.payload;
      localStorage.clear();
      localStorage.setItem(
        "authData",
        JSON.stringify({
          token,
          userId,
          expirationTime,
          isCoordinator,
          isAssitant,
        })
      );
      return {
        values: {
          isAuth: true,
          userId,
          token,
          isCoordinator,
          isAssitant,
        },
      };
    },
  },
});

export const { logIn, logOut } = auth.actions;
export default auth.reducer;
