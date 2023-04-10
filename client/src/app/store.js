import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import sentimentReducer from '../features/sentiment/sentimentSlice'
import tweetOfUserReducer from '../features/tweetOfUser/tweetOfUserSlice'
import {countriesReducer, trendReducer, nearTrendReducer} from '../features/trends/trendSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sentiment: sentimentReducer,
    tweetuser: tweetOfUserReducer,
    countryTrends: trendReducer,
    countries: countriesReducer,
    nearMeTrends: nearTrendReducer,
  },
})

export default store
