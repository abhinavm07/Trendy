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
    const [passwordStrength, setPasswordStrength] = useState('')

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
        if (['password', 'password2'].includes(e.target.name)) {
            setPasswordStrength(checkPasswordStrength(e.target.value));
        }
        setLoginFormData(e)
    }

    function checkPasswordStrength(password) {
        // Define the criteria for password strength
        const minLength = 8; // Minimum password length
        const minLowercase = 1; // Minimum lowercase characters
        const minUppercase = 1; // Minimum uppercase characters
        const minNumbers = 1; // Minimum numeric characters
        const minSpecialChars = 1; // Minimum special characters

        // Check the password against the criteria
        const lowercaseRegex = /[a-z]/g;
        const uppercaseRegex = /[A-Z]/g;
        const numbersRegex = /[0-9]/g;
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/g;

        const isLengthValid = password.length >= minLength;
        const isLowercaseValid = (password.match(lowercaseRegex) || []).length >= minLowercase;
        const isUppercaseValid = (password.match(uppercaseRegex) || []).length >= minUppercase;
        const isNumbersValid = (password.match(numbersRegex) || []).length >= minNumbers;
        const isSpecialCharsValid = (password.match(specialCharsRegex) || []).length >= minSpecialChars;

        // Determine the password strength
        if (isLengthValid && isLowercaseValid && isUppercaseValid && isNumbersValid && isSpecialCharsValid) {
            return 'Strong';
        } else if (isLengthValid && (isLowercaseValid || isUppercaseValid || isNumbersValid || isSpecialCharsValid)) {
            return 'Moderate';
        } else {
            let errorMessage = 'Password must include:';
            if (!isLengthValid) {
                errorMessage += ' at least ' + minLength + ' characters';
            }
            if (!isLowercaseValid) {
                errorMessage += ', lowercase characters';
            }
            if (!isUppercaseValid) {
                errorMessage += ', uppercase characters';
            }
            if (!isNumbersValid) {
                errorMessage += ', numeric characters';
            }
            if (!isSpecialCharsValid) {
                errorMessage += ', special characters';
            }
            return errorMessage;
        }
    }


    function setLoginFormData(e) {
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
            if (!['Strong', 'Moderate'].includes(passwordStrength)) {
                toast.error('Password is too weak.')
                return;
            } else {
                const userData = {name, email, password}
                dispatch(register(userData))
            }
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
                    <div className='text-center text-sm text-red mt-2 mb-2'>
                        {
                            !['Moderate', 'Strong'].includes(passwordStrength) &&
                            <span className='text-red-500'>{passwordStrength}</span>
                        }
                    </div>
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
