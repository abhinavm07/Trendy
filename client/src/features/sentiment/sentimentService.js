import axios from "axios";

const API_URL = "/api/routes/sentiment";

//Register user
const emotion = async (emotionData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const body = emotionData;
  const response = await axios.post(API_URL, body, config);
  return response.data;
};

const sentimentService = {
  emotion,
};

export default sentimentService;
