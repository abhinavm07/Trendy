import axios from "axios";
const API_URL = "/api/routes/";

const compareUsers = async (usersData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const body = usersData;
    const response = await axios.post(`${API_URL}compareUsers`, body, config);
    return response.data;
};


const compareUsersServices = {compareUsers};
export default compareUsersServices;