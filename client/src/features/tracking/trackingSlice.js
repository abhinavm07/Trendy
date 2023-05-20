import {createAsyncThunk} from "@reduxjs/toolkit";
import trackingServices from "../tracking/trackingServices.js";

export const addTrack = createAsyncThunk(
    "track/addTrack",
    async (data = "", thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await trackingServices.track(data, token);
        } catch (error) {
            const message =
                error?.response?.data || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getOldTrackings = createAsyncThunk(
    "track/getOldTrackings",
    async (data = "", thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await trackingServices.getOldTrackings(token);
        } catch (error) {
            const message =
                error?.response?.data || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const toggleTracking = createAsyncThunk(
    "track/toggleTracking",
    async (data = "", thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await trackingServices.toggleTracking(data, token);
        } catch (error) {
            const message =
                error?.response?.data || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);