import axios from "axios";

const API_URL = "/api/routes/";

const listUsers = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(`${API_URL}listUsers`, config);
    return response.data;
};

const toggleAdmin = async (email, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(
        `${API_URL}toggleAdminPermission`,
        {email},
        config
    );
    return response.data;
}

const toggleAccountStatus = async (email, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(
        `${API_URL}toggleAccountStatus`,
        {email},
        config
    );
    return response.data;
}
const settingsServices = {
    listUsers,
    toggleAdmin,
    toggleAccountStatus,
};

export default settingsServices;
