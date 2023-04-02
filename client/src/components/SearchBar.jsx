import { useState, useEffect } from 'react'
import { FaSignInAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { emotions, reset } from '../features/sentiment/sentimentSlice'
import Spinner from '../components/Spinner'
import SerachResult from './SerachResult'
const SearchBar = () => {
  const [formData, setFormData] = useState({
    data: '',
  })

  const { data } = formData

  console.log(formData)
  const dispatch = useDispatch()
  const navigate = useNavigate()
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
      <div className=' w-full h-full'>
        <div className='flex justify-center items-center h-20 w-full my-10'>
          <SerachResult emotion={emotion} />
        </div>
        <form onSubmit={onSubmit} className='w-full'>
          <div className='form-group'>
            <input
              type='text'
              placeholder='Search here'
              name='data'
              id='data'
              value={data}
              onChange={onChange}
              className='flex mx-2 input input-bordered input-info w-full'
            />
          </div>
          <button type='submit' className='btn btn-outline '>
            Check Sentiment
          </button>
        </form>
      </div>
    </>
  )
}

export default SearchBar
