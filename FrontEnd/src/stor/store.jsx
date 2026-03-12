import { configureStore } from '@reduxjs/toolkit'
import SlicEauth from '../slices/auth'
import reducercar from '../slices/carSlice'
import clientReducer from "../slices/ClientSlice";

export const store = configureStore({
  reducer: {
    auth:SlicEauth,
    Car:reducercar,
     client: clientReducer

  },
})