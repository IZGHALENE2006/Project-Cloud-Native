import { configureStore } from '@reduxjs/toolkit'
import SlicEauth from '../slices/auth'
import reducercar from '../slices/carSlice'
export const store = configureStore({
  reducer: {
    auth:SlicEauth,
    Car:reducercar
  },
})