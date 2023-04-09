import axios from 'axios'

const API_URL = '/api/routes/sentiment'

//Register user
const emotion = async (emotionData) => {
  const response = await axios.post(API_URL, emotionData)

  return response.data
}

const sentimentService = {
  emotion,
}

export default sentimentService
