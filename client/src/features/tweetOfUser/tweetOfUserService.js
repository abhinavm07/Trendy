import axios from 'axios'

const API_URL = '/api/routes/twtuser'

//Register user
const twtUser = async (twtUserName, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.post(API_URL, twtUserName, config)
  return response.data
}

const tweetOfUserService = {
  twtUser,
}

export default tweetOfUserService
