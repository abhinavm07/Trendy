import axios from 'axios'

const API_URL = '/api/sentiment'

//Register user
const emotion = async (emotionData) => {
  const response = await axios.post(API_URL, emotionData)
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

const sentimentService = {
  emotion,
}

export default sentimentService
