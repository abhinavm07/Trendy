import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import tweetOfUserService from './tweetOfUserService'

const initialState = {
  twtUser: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

//
export const twtUsers = createAsyncThunk(
  'tweetuser/twtUser',
  async (twtUsername, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await tweetOfUserService.twtUser(twtUsername, token)
    } catch (error) {
      const message = error?.response?.data || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const tweetuserSlice = createSlice({
  name: 'tweetuser',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false
      state.isSuccess = false
      state.isLoading = false
      state.message = ''
      state.twtUser = {}
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(twtUsers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(twtUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.twtUser = action.payload
      })
      .addCase(twtUsers.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.twtUser = null
        state.message = action.payload
      })
  },
})

export const { reset } = tweetuserSlice.actions

export default tweetuserSlice.reducer
