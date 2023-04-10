import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import trendServices from "./trendServices";

const initialTrendState = {
    trends: [],
    isErrorTrends: false,
    isSuccessTrends: false,
    isLoadingTrends: false,
    messageTrends: '',
}

const initialCountryState = {
    countries: [],
    isErrorCountry: false,
    isSuccessCountry: false,
    isLoadingCountry: false,
    messageCountry: '',
}

const initialNearTrend = {
    nearTrends: [],
    isErrorNear: false,
    isSuccessNear: false,
    isLoadingNear: false,
    messageNear: '',
}

export const getTrendCountries = createAsyncThunk(
    'trends/getTrendCountries',
    async (data = '', thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await trendServices.getTrendCountries(token)
        } catch (error) {
            const message = error?.response?.data || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const trendCountries = createSlice({
    name: 'countries',
    initialState: initialCountryState,
    reducers: {
        reset: (state) => {
            state.isErrorCountry = false
            state.isSuccessCountry = false
            state.isLoadingCountry = false
            state.messageCountry = ''
            state.countries = {}
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTrendCountries.pending, (state) => {
                state.isLoadingCountry = true
            })
            .addCase(getTrendCountries.fulfilled, (state, action) => {
                state.isLoadingCountry = false
                state.isSuccessCountry = true
                state.countries = action.payload
            })
            .addCase(getTrendCountries.rejected, (state, action) => {
                state.isLoadingCountry = false
                state.isErrorCountry = true
                state.countries = null
                state.messageCountry = action.payload
            })
    },
})

export const getTrends = createAsyncThunk(
    'trends/getTrends',
    async (country = '', thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await trendServices.getTrends(country, token)
        } catch (error) {
            const message = error?.response?.data || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)
export const trendsSlicer = createSlice({
    name: 'trends',
    initialState: initialTrendState,
    reducers: {
        reset: (state) => {
            state.isErrorTrends = false
            state.isSuccessTrends = false
            state.isLoadingTrends = false
            state.messageTrends = ''
            state.trends = {}
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTrends.pending, (state) => {
                state.isLoadingTrends = true
            })
            .addCase(getTrends.fulfilled, (state, action) => {
                state.isLoadingTrends = false
                state.isSuccessTrends = true
                state.trends = action.payload
            })
            .addCase(getTrends.rejected, (state, action) => {
                state.isLoadingTrends = false
                state.isErrorTrends = true
                state.countries = null
                state.messageTrends = action.payload
            })
    },
})

export const getNearMeT = createAsyncThunk(
    'trends/getNearMeT',
    async (geoLocation = {}, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await trendServices.nearMeT(geoLocation, token)
        } catch (error) {
            const message = error?.response?.data || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)
export const nearMeTSlicer = createSlice({
    name: 'nearTrends',
    initialState: initialNearTrend,
    reducers: {
        reset: (state) => {
            state.isErrorNear = false
            state.isSuccessNear = false
            state.isLoadingNear = false
            state.messageNear = ''
            state.nearTrends = {}
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNearMeT.pending, (state) => {
                state.isLoadingNear = true
            })
            .addCase(getNearMeT.fulfilled, (state, action) => {
                state.isLoadingNear = false
                state.isSuccessNear = true
                state.nearTrends = action.payload
            })
            .addCase(getNearMeT.rejected, (state, action) => {
                state.isLoadingNear = false
                state.isErrorNear = true
                state.nearTrends = null
                state.messageNear = action.payload
            })
    },
})

export const resetCountries = trendCountries.actions.reset
export const resetTrends = trendsSlicer.actions.reset
export const resetNearTrends = nearMeTSlicer.actions.reset

export const countriesReducer = trendCountries.reducer
export const trendReducer = trendsSlicer.reducer
export const nearTrendReducer = nearMeTSlicer.reducer
