import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import sentimentReducer from '../features/sentiment/sentimentSlice'
import tweetOfUserReducer from '../features/tweetOfUser/tweetOfUserSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sentiment: sentimentReducer,
    tweetuser: tweetOfUserReducer,
  },
})

export default store
