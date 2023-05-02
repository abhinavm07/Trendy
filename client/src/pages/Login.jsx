import { useState, useEffect } from 'react'
import { FaSignInAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'
import image from '../assets/image.jpeg'
function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }
    //Redirect when logged in
    if (isSuccess || user) {
      navigate('/dashboard')
    }
    dispatch(reset())
  }, [dispatch, isError, isSuccess, message, navigate, user])

  const onChange = (e) => {
    setFormData((prevstate) => ({
      ...prevstate,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const userData = { email, password }
    dispatch(login(userData))
  }
  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      {/* <section className='heading'>
        <h1>
          <FaSignInAlt /> Login
        </h1>
        <p>Please Login to get support</p>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              type='email'
              className='form-control'
              id='email'
              value={email}
              name='email'
              onChange={onChange}
              placeholder='Enter email'
              required
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='password'
              value={password}
              name='password'
              onChange={onChange}
              placeholder='Enter password'
              required
            />
          </div>

          <div className='form-group'>
            <button className='btn btn-block'>Submit</button>
          </div>
        </form>
      </section>
    </> */}
      <div className='w-56 h-auto '>
        <img className='w-full h-full' src={image} alt='' />
      </div>
      <div className='bg-grey-lighter min-h-screen flex flex-col'>
        <div className='container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2'>
          <div className='bg-white px-6 py-8 rounded shadow-md w-full'>
            <h1 className='mb-8 text-3xl text-center text-black '>Sign In</h1>
            <form onSubmit={onSubmit}>
              <input
                type='text'
                className='block border border-grey-light w-full p-3 rounded mb-4'
                name='email'
                onChange={onChange}
                value={email}
                placeholder='Enter your email'
              />

              <input
                type='password'
                className='block border border-grey-light w-full p-3 rounded mb-4'
                name='password'
                onChange={onChange}
                value={password}
                placeholder='Enter your password'
              />

              <button
                type='submit'
                className='w-full text-center py-3 rounded bg-primary text-white hover:bg-green-dark focus:outline-none my-1'
              >
                Sign In
              </button>
            </form>
          </div>

          <div className='text-grey-dark mt-6'>
            Don't have an account?{' '}
            <Link
              className='no-underline border-b border-blue text-blue'
              to='/register'
            >
              Register
            </Link>
            .
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
