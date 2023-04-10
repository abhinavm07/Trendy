import { useState, useEffect } from 'react'
import { FaSignInAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { emotions, reset } from '../features/sentiment/sentimentSlice.js'
import Spinner from '../components/Spinner.jsx'
import SearchResult from '../components/SearchResult.jsx'
import SearchBar from "../components/SearchBar.jsx";
import {IoSearch} from "react-icons/all.js";
import {IoHappy} from "react-icons/io5";
const SentimentSearchBar = () => {
  const [formData, setFormData] = useState({
    data: '',
  })

  const { data } = formData

  const dispatch = useDispatch()
  const { emotion, isLoading, isError, message } = useSelector(
    (state) => state.sentiment
  )
  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    dispatch(reset())
  }, [dispatch, isError, message])

  const onSubmit = (e) => {
    e.preventDefault()
    const emotionData = { data }
    dispatch(emotions(emotionData))
  }
  const onChange = (e) => {
    setFormData((prevstate) => ({
      ...prevstate,
      [e.target.name]: e.target.value,
    }))
  }
  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <div className='sidecontainer'>
        <SearchBar
            onSubmit={onSubmit}
            value={data}
            onChange={onChange}
            name='data'
            id='data'
            placeholder='Search here'
            disabled={!data}
            type='text'
            icon={<IoHappy/>}
            buttonIcon={<IoSearch/>}
        />
        <div className='sentiment-analysis-result'>
          <div key={1}>
            {' '}
            <span>Sentiment:</span> {emotion.Sentiment}
          </div>
          <div className='flex justify-center items-center h-20 w-full my-10'>
            <SearchResult emotion={emotion.Sentiment} />
          </div>
        </div>
      </div>
    </>
  )
}

export default SentimentSearchBar
