import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import sentimentService from "./sentimentService";

const initialState = {
  emotion: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

//
export const emotions = createAsyncThunk(
  "sentiment/emotions",
  async (emotion, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await sentimentService.emotion(emotion, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const sentimentSlice = createSlice({
  name: "sentiment",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(emotions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(emotions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.emotion = action.payload;
      })
      .addCase(emotions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.emotion = null;
        state.message = action.payload;
      });
  },
});

export const { reset } = sentimentSlice.actions;

export default sentimentSlice.reducer;
