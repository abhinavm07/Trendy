import {useEffect, useState} from 'react'
import {FaUser} from 'react-icons/fa'
import {toast} from 'react-toastify'
import {useDispatch, useSelector} from 'react-redux'
import {register, reset} from '../../features/auth/authSlice.js'
import {useNavigate, Link} from 'react-router-dom'
import Spinner from '../../components/Spinner.jsx'

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
    })

    const {name, email, password, password2} = formData

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user, isLoading, isError, isSuccess, message} = useSelector(
        (state) => state.auth
    )

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }
        //Redirect when logged in
        if (isSuccess || user) {
            navigate('/')
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

        if (password !== password2) {
            toast.error('Passwords do not match')
        } else {
            const userData = {name, email, password}
            dispatch(register(userData))
        }
    }

    if (isLoading) {
        return <Spinner/>
    }

    return (
        <>
            <div className='bg-white px-6 py-8'>
                <h1 className='mb-8 text-3xl text-center text-black '>Sign up</h1>
                <form onSubmit={onSubmit}>
                    <input
                        type='text'
                        className='block border border-grey-light w-full p-3 rounded mb-4'
                        name='name'
                        value={name}
                        onChange={onChange}
                        placeholder='Full Name'
                    />

                    <input
                        type='text'
                        className='block border border-grey-light w-full p-3 rounded mb-4'
                        name='email'
                        onChange={onChange}
                        placeholder='Email'
                    />

                    <input
                        type='password'
                        className='block border border-grey-light w-full p-3 rounded mb-4'
                        name='password'
                        onChange={onChange}
                        placeholder='Password'
                    />
                    <input
                        type='password'
                        className='block border border-grey-light w-full p-3 rounded mb-4'
                        name='password2'
                        value={password2}
                        onChange={onChange}
                        placeholder='Confirm Password'
                    />

                    <button
                        type='submit'
                        className='w-full text-center py-3 rounded bg-primary text-white hover:bg-green-dark focus:outline-none my-1'
                    >
                        Create Account
                    </button>
                </form>
                <div className='text-center text-sm text-grey-dark mt-4'>
                    By signing up, you agree to the &nbsp;
                    <a
                        className='no-underline border-b border-grey-dark text-grey-dark'
                        href='client/src/pages#'
                    >
                        Terms of Service
                    </a>{' '}
                    and &nbsp;
                    <a
                        className='no-underline border-b border-grey-dark text-grey-dark'
                        href='client/src/pages#'
                    >
                        Privacy Policy
                    </a>
                </div>
            </div>
            <div className='text-grey-dark mt-6'>
                Already have an account?{' '}
                <Link
                    className='no-underline border-b border-blue text-blue'
                    to='/login'
                >
                    Log in
                </Link>
                .
            </div>
        </>
    )
}

export default Register
