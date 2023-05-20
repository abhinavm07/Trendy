import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import settingsServices from "./settingsServices";
import {useSelector} from "react-redux";

export const listUsers = createAsyncThunk(
    "settings/userList",
    async (data = '', thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await settingsServices.listUsers(token);
        } catch (error) {
            const message =
                error?.response?.data || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const toggleAdmin = createAsyncThunk(
    "settings/toggleAdmin",
    async (data = '', thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await settingsServices.toggleAdmin(data, token);
        } catch (error) {
            const message =
                error?.response?.data || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const toggleAccountStatus = createAsyncThunk(
    "settings/toggleAdmin",
    async (data = '', thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await settingsServices.toggleAccountStatus(data, token);
        } catch (error) {
            const message =
                error?.response?.data || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);
