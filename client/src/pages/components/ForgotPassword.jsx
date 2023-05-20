import {useState, useEffect} from 'react'
import {toast} from 'react-toastify'
import {useNavigate, Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import Spinner from '../../components/Spinner.jsx'
import {forgotPassword} from "../../features/auth/authSlice.js";

function ForgotPassword() {
    const [formData, setFormData] = useState({
        email: '',
    })

    const {email} = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {user, isLoading, isSuccess, isError, message} = useSelector(
        (state) => state.auth
    )

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }
    }, [dispatch, isError, isSuccess, message, navigate, user])

    const onChange = (e) => {
        setFormData((prevstate) => ({
            ...prevstate,
            [e.target.name]: e.target.value,
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        const userData = {email}
        const response = await dispatch(forgotPassword(userData))
        if (response.payload) {
            toast[response.payload.status](response.payload.msg)
            //wait for 5 seconds and redirect to login page
            if (response.payload.status === 'success') {
                setTimeout(() => {
                    navigate('/login')
                }, 5000);
            }
        }
    }
    if (isLoading) {
        return <Spinner/>
    }

    return (
        <>
            <div className='bg-white px-6 py-8 '>
                <h1 className='mb-8 text-3xl text-center text-black '>Forgot Password</h1>
                <form onSubmit={onSubmit}>
                    <input
                        type='text'
                        className='block border border-grey-light w-full p-3 rounded mb-4'
                        name='email'
                        onChange={onChange}
                        value={email}
                        placeholder='Enter your email'
                    />

                    <button
                        type='submit'
                        className='w-full text-center py-3 rounded bg-primary text-white hover:bg-green-dark focus:outline-none my-1'
                    >
                        Send Email
                    </button>
                </form>
            </div>
            <div className='text-center text-sm text-grey-dark mt-4'>
                If you have an account. An email will be sent to you with instructions on how to reset your password.
            </div>
            <div className='text-grey-dark mt-6'>
                <Link
                    className='no-underline border-b border-blue text-blue'
                    to='/login'
                >
                    Go Back
                </Link>
                .
            </div>
        </>
    )
}

export default ForgotPassword
