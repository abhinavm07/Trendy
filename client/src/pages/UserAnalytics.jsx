import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {twtUsers, reset} from '../features/tweetOfUser/tweetOfUserSlice'
import Spinner from '../components/Spinner'
import {toast} from 'react-toastify'
import SentimentSearchResults from '../components/SentimentSearchResults.jsx'
import {IoAnalytics, IoSearch} from "react-icons/all.js";
import SearchBar from "../components/SearchBar.jsx";
import {Tooltip} from 'react-tooltip'
import Modal from "../components/Modal.jsx";
import {Charts} from "../components/Charts.jsx";
import {IoSave} from "react-icons/io5";
import TweetBox from "../components/TweetBox.jsx";
import {saveTweet} from "../features/favourites/favouriteSlice.js";
import {addTrack} from "../features/tracking/trackingSlice.js";


const UserAnalytics = () => {
    const [formData, setFormData] = useState({
        twtUsername: '',
    })
    const {twtUser, isLoading, isError, isSuccess, message} = useSelector(
        (state) => state.tweetuser
    )

    const [isTracked, setIsTracked] = useState(false);


    const {twtUsername} = formData
    const dispatch = useDispatch()
    const [isSaving, setIsSaving] = useState(false)

    const [tweetBreakdownModal, setTweetBreakdownModal] = useState({
        visible: false,
        title: 'Tweets Context Breakdown',
        body: '',
    });


    useEffect(() => {
        if (isError) {
            toast.error(message)
        }
        dispatch(reset())
    }, [dispatch, isError, message])


    const onSubmit = async (e) => {
        e.preventDefault()
        const twtuserName = {twtUsername}
        const result = await dispatch(twtUsers(twtuserName))
        setIsTracked(result.payload?.isTracked || false)
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

    function getBreakdownChart(tweets) {
        if (!tweets) return;

        const extraOptions = {
            height: '400',
            width: '700',
            canSave: true,
            canExport: true,
        }
        const breakdownOption = {
            label: 'Breakdown',
            chartTitle: `${twtUsername} Tweets Breakdown`,
        };

        return <Charts chartOptions={breakdownOption} data={tweets} extraOptions={extraOptions}/>
    }

    async function saveCurrentTweet(data) {
        setIsSaving(true);
        const neededData = {user: twtUser?.userData?.data, tweetData: data};
        const response = await dispatch(saveTweet(neededData))
        setIsSaving(false);
        const {message = ''} = response.payload;
        if (message) {
            toast.error(message)
        } else {
            toast.success('Tweet saved successfully')
        }
    }

    const handleTrackChange = async (event) => {
        setIsTracked(event.target.checked);
        const result = await dispatch(addTrack(twtUser))
        const {msg = '', status = 'success'} = result.payload;
        if (status === 'error') {
            setIsTracked(false);
        }
        toast[status](msg || 'You are now watching this user.')
    }

    return (
        <>
            {isSaving && <Spinner/>}
            <div className='sidecontainer'>
                <SearchBar
                    onSubmit={onSubmit}
                    value={twtUsername}
                    onChange={onChange}
                    name='twtUsername'
                    id='twtUsername'
                    placeholder='Search here'
                    disabled={!twtUsername}
                    type='text'
                    icon='@'
                    buttonIcon={<IoSearch/>}
                />
                {twtUser?.userData && <div className='meta-user-details'>
                    <div className='grid grid-cols-5 gap-5 mt-2'>
                        <div className='col-span-1'>
                            <div className='flex flex-col meta-user-info'>
                                Followers
                            </div>
                        </div>
                        <div className='col-span-1'>
                            <div className='flex flex-col meta-user-info'>
                                Following
                            </div>
                        </div>
                        <div className='col-span-1'>
                            <div className='flex flex-col meta-user-info'>
                                Tweets
                            </div>
                        </div>
                        <div className='col-span-1'>
                            <div className='flex flex-col meta-user-info'>
                                Breakdown
                            </div>
                        </div>
                        <div className='col-span-1'>
                            <div className='flex flex-col meta-user-info'>
                                Track User
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-5 gap-5 mt-2'>
                        <div className='col-span-1'>
                            <div className='flex flex-col user-detail-small'>
                                {twtUser?.userData?.data?.public_metrics?.followers_count}
                            </div>
                        </div>
                        <div className='col-span-1'>
                            <div className='flex flex-col user-detail-small'>
                                {twtUser?.userData?.data?.public_metrics?.following_count}
                            </div>
                        </div>
                        <div className='col-span-1'>
                            <div className='flex flex-col user-detail-small'>
                                {twtUser?.userData?.data?.public_metrics?.tweet_count}
                            </div>
                        </div>
                        <div className='col-span-1'>
                            <div className='flex flex-col user-detail-small' id='tweet-breakdown-chart-tooltip'
                                 onClick={() => setTweetBreakdownModal({
                                     visible: true,
                                     title: 'Tweets Context Breakdown',
                                     body: getBreakdownChart(twtUser?.contextVolume),
                                 })}>
                                &#8644;
                            </div>
                            <Tooltip anchorId='tweet-breakdown-chart-tooltip'
                                     content='Click here to see the tweet breakdown'/>
                        </div>
                        <div className='col-span-1'>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox"
                                       className='cursor-pointer'
                                       checked={isTracked}
                                       onChange={handleTrackChange}
                                       disabled={isTracked}
                                />

                            </label>
                        </div>
                    </div>
                </div>
                }
            </div>
            {twtUser?.userData && <div className='flex flex-col'>
                <TweetBox content={twtUser} onSave={saveCurrentTweet}/>
            </div>
            }
            {
                tweetBreakdownModal.visible &&
                <Modal context={tweetBreakdownModal} close={() => setTweetBreakdownModal({visible: false})}/>
            }
        </>
    )
}

export default UserAnalytics
