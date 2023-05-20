import axios from "axios";
const API_URL = "/api/routes/";

const saveTrendsChart = async (trendData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const body = trendData;
  const response = await axios.post(`${API_URL}saveChart`, body, config);
  return response.data;
};

const saveTweet = async (tweetData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const body = tweetData;
  const response = await axios.post(`${API_URL}saveTweet`, body, config);
  return response.data;
};

const shareContent = async (savedInfo, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const body = { savedInfo };

  const response = await axios.post(`${API_URL}shareContent`, body, config);
  return response.data;
};

const fetchFavouriteCharts = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${API_URL}retrieveChart`, {}, config);
  return response.data;
};

const fetchFavouriteTweets = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${API_URL}retrieveTweets`, {}, config);
  return response.data;
};

const fetchAllShared = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${API_URL}retrieveAllShared`, {}, config);
  return response.data;
};

const favouriteServices = {
  saveTrendsChart,
  fetchFavouriteCharts,
  fetchFavouriteTweets,
  fetchAllShared,
  saveTweet,
  shareContent,
};

export default favouriteServices;
