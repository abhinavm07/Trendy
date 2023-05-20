import {createAsyncThunk} from "@reduxjs/toolkit";
import compareUsersServices from "./compareUsersServices";

export const compareUsers = createAsyncThunk(
    "compare/users",
    async (data = "", thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await compareUsersServices.compareUsers(data, token);
        } catch (error) {
            const message =
                error?.response?.data || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);
