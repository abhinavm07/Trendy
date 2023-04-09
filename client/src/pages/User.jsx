import {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {twtUsers, reset} from '../features/tweetOfUser/tweetOfUserSlice'
import Spinner from '../components/Spinner'
import {toast} from 'react-toastify'
import SearchResult from '../components/SearchResult.jsx'

const User = () => {
    const [formData, setFormData] = useState({
        twtUsername: '',
    })

    const {twtUsername} = formData
    const dispatch = useDispatch()

    const {twtUser, isLoading, isError, isSuccess, message} = useSelector(
        (state) => state.tweetuser
    )
    useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        dispatch(reset())
    }, [dispatch, isError, message])

    const onSubmit = (e) => {
        e.preventDefault()
        const twtuserName = {twtUsername}
        dispatch(twtUsers(twtuserName))
    }
    const onChange = (e) => {
        setFormData((prevstate) => ({
            ...prevstate,
            [e.target.name]: e.target.value,
        }))
    }
    if (isLoading) {
        return <Spinner/>
    }

    function getClassName(sentiment = 'neutral') {
        return `tweetbox sentiment-${sentiment}`;
    }

    return (
        <>
            <div className='w-full h-full'>
                <form onSubmit={onSubmit} className='w-full'>
                    <div className='form-group'>
                        <input
                            type='text'
                            placeholder='Search here'
                            name='twtUsername'
                            id='twtUsername'
                            value={twtUsername}
                            onChange={onChange}
                            className='flex mx-2 input input-bordered input-info w-full'
                        />
                    </div>
                    <button type='submit' className='btn btn-outline ' disabled={!twtUsername}>
                        Search UserName
                    </button>
                </form>
            </div>
            {twtUser?.userData && <div className='flex flex-col'>
                <div>
                    <br/>
                    <div className='w-full flex '>
                    </div>
                    {/* end of avatar  */}
                    <br/>
                    <div className='user-tweet-details'>
                        <div className='flex '>
                            {/* start of  table */}
                            <div className='overflow-x-auto mx-2 '>
                                <table className='table table-compact w-full'>
                                    <thead>
                                    <tr>
                                        <th>SN</th>
                                        <th>User Stats</th>
                                        <th>Count</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <th>1</th>
                                        <td>Followers</td>
                                        <td>
                                            {twtUser?.userData?.data?.public_metrics?.followers_count}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>2</th>
                                        <td>Following</td>
                                        <td>
                                            {twtUser?.userData?.data?.public_metrics?.following_count}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>3</th>
                                        <td>Tweets</td>
                                        <td>
                                            {twtUser?.userData?.data?.public_metrics?.tweet_count}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>4</th>
                                        <td>Replies</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <th>5</th>
                                        <td>Likes</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <th>6</th>
                                        <td>Account Status</td>
                                        <td></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            {/* end of  table */}
                        </div>
                        <div className='recent-tweets'>
                            <div className='justify-center'>
                                <div className='carousel carousel-vertical rounded-box all-tweet-list'>
                                    {twtUser?.twtData?.map((data) => (
                                        <div className='carousel-item recent-tweet' key={data.id}>
                                            <div className={getClassName(data.sentiment)}>
                                                <div className='warning-banner'>
                                                    <div className='flex justify-center items-center h-10 w-full my-10'>
                                                        <SearchResult emotion={data.sentiment} key={data.id}/>
                                                    </div>
                                                </div>
                                                <div className='avatar-username'>
                                                    <div className='avatar'>
                                                        <img
                                                            src='https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector.png'/>
                                                    </div>
                                                    <div className='username-box'>
                                                <span className='name'>
                                                 {twtUser?.userData?.data?.name}
                                                </span>
                                                        <p className='username'>
                                                            {twtUser?.userData?.data?.username}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className='tweet'>
                                                    {data.tweet}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>}
        </>
    )
}

export default User
