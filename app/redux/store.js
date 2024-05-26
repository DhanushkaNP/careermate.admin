import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth-slice";
import uniReducer from "./features/university-slice";
import { useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    authReducer,
    uniReducer,
  },
});

export const useAppSelector = useSelector;
