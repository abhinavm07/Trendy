import axios from "axios";
const API_URL = "/api/routes/";

const track = async (trackData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const body = trackData;

    const response = await axios.post(`${API_URL}track`, body, config);
    return response.data;
};

const getOldTrackings = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(`${API_URL}retrieveTracking`, config);
    return response.data;
}

const toggleTracking = async (data, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.post(`${API_URL}changeTrackStatus`,data, config);
    return response.data;
}

const trackingServices = {track, getOldTrackings, toggleTracking};

export default trackingServices;