import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import sentimentReducer from '../features/sentiment/sentimentSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sentiment: sentimentReducer,
  },
})

export default store
