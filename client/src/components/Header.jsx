import {FaSignInAlt, FaSignOutAlt, FaUser} from 'react-icons/fa'
import {Link, useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {logout, reset} from '../features/auth/authSlice'
import {IoHome} from "react-icons/io5";

function Header() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector((state) => state.auth)

    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate('/login')
    }

    return (
        <header className='header'>
            <div className='logo'>
                {user ? <Link to='/dashboard'><IoHome/></Link> : 'Trendy'}
            </div>
            <ul>
                {user ? (
                    <li>
                        <button className='btn bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded' onClick={onLogout}>
                            <FaSignOutAlt/> Logout{' '}
                        </button>
                    </li>
                ) : (
                    <>
                        {/*<li>*/}
                        {/*    <Link to='/login'>*/}
                        {/*        <FaSignInAlt/>*/}
                        {/*        Login*/}
                        {/*    </Link>*/}
                        {/*</li>*/}
                        {/*<li>*/}
                        {/*    <Link to='/register'>*/}
                        {/*        <FaUser/>*/}
                        {/*        Register*/}
                        {/*    </Link>*/}
                        {/*</li>*/}
                    </>
                )}
            </ul>
        </header>
    )
}

export default Header
