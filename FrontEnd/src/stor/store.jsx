import { configureStore } from '@reduxjs/toolkit'
import SlicEauth from '../slices/auth'
export const store = configureStore({
  reducer: {
    auth:SlicEauth
  },
})