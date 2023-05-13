import axios from 'axios'

const API_URL = '/api/routes/'

const getTrendCountries = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.get(`${API_URL}availableCountry`, config)
    return response.data
}

const getTrends = async(country, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const body = {
        woeid: country
    };
    const response = await axios.post(`${API_URL}trend`, body, config)
    return response.data
}

const nearMeT = async(geoLocation, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const body = geoLocation;
    const response = await axios.post(`${API_URL}nearMe`, body, config)
    return response.data
}



const trendServices = {getTrendCountries, getTrends, nearMeT};
export default trendServices;
