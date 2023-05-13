import { createAsyncThunk } from "@reduxjs/toolkit";
import favouriteServices from "../favourites/favouriteServices";

export const saveTrendChart = createAsyncThunk(
  "charts/saveTrendChart",
  async (data = "", thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await favouriteServices.saveTrendsChart(data, token);
    } catch (error) {
      const message =
        error?.response?.data || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const saveTweet = createAsyncThunk(
  "tweets/saveTweet",
  async (data = "", thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await favouriteServices.saveTweet(data, token);
    } catch (error) {
      const message =
        error?.response?.data || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const shareContent = createAsyncThunk(
  "shared/shareContent",
  async (data = "", thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await favouriteServices.shareContent(data, token);
    } catch (error) {
      const message =
        error?.response?.data || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getSavedCharts = createAsyncThunk(
  "charts/savedCharts",
  async (data = "", thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await favouriteServices.fetchFavouriteCharts(token);
    } catch (error) {
      const message =
        error?.response?.data || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getSavedTweets = createAsyncThunk(
  "tweets/savedTweets",
  async (data = "", thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await favouriteServices.fetchFavouriteTweets(token);
    } catch (error) {
      const message =
        error?.response?.data || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getSharedContents = createAsyncThunk(
  "shared/sharedContents",
  async (data = "", thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await favouriteServices.fetchAllShared(token);
    } catch (error) {
      const message =
        error?.response?.data || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
