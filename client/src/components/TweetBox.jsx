import SentimentSearchResults from "./SentimentSearchResults.jsx";
import {IoSave, IoShare} from "react-icons/io5";
import {Tooltip} from "react-tooltip";
import React, {useEffect, useState} from "react";
import Modal from "./Modal.jsx";
import {ImShare} from "react-icons/all.js";
import ShareModal from "./ShareModal.jsx";
import {getSharedContents, shareContent} from "../features/favourites/favouriteSlice.js";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import Chip from "./Chip.jsx";

export default function TweetBox({content, onSave, canSave = true, canShare = false}) {
    const [tweetContextModal, setTweetContextModal] = useState({
        visible: false,
        title: '',
        body: '',
    });
    let actualTweetData = content?.twtData;
    let actualUserData = content?.userData?.data;
    const [shareModalVisibility, setShareModalVisibility] = useState(false);
    const dispatch = useDispatch();

    //if share is enabled lets assumed its in favourite page
    if (canShare) {
        const {sentiment, tweetID, tweet, context, tweetByUsername, tweetByFullname, _id} = content;
        const savedTweetData = [{
            sentiment,
            id: tweetID,
            tweet,
            context
        }];
        const savedUserData = {
            name: tweetByFullname,
            username: tweetByUsername
        }
        actualTweetData = savedTweetData;
        actualUserData = savedUserData;
    }


    function getClassName(sentiment = 'neutral') {
        return `tweetbox sentiment-${sentiment}`;
    }

    function openTweetContext(tweet) {
        setTweetContextModal({
            visible: (tweet?.context && tweet?.context.length > 0) ? true : false,
            title: 'Tweet Context',
            body: createTable(tweet?.context)
        });
    }

    function createTable(tweet) {
        return tweet?.map((t, index) => {
            return <div key={index} className='tweet-context flex flex-row'>
                <span className='tweet-context-body'><Chip content={t}/></span>
            </div>
        })
    }

    function saveTweet(tweet) {
        onSave(tweet);
    }

    function shareTweet(tweet) {
        setShareModalVisibility(true);
    }

    async function shareFunctionCallback(email) {
        const shareInfo = {sharedTo: email, contentType: 'tweet', savedId: content._id};
        const res = await dispatch(shareContent(shareInfo));
        const {msg, type} = res.payload;
        if (msg) {
            toast[type](msg);
        }
        if (type === 'success') {
            setShareModalVisibility(false);
            dispatch(getSharedContents());
        }
    }

    const [tweetDp, setTweetDp] = useState( '');

    function randomlyPickSrc() {
        const imgSrc = [
            'https://cdn4.iconfinder.com/data/icons/iconsimple-logotypes/512/twitter-512.png',
            'https://cdn-icons-png.flaticon.com/512/560/560200.png',
            'https://www.pngmart.com/files/21/Admin-Profile-Vector-PNG-Clipart.png'
        ];
        const index = Math.floor(Math.random() * imgSrc.length);
        setTweetDp(imgSrc[index]);
    }

    useEffect(() => {
        randomlyPickSrc();
    }, [tweetDp]);

    return (<div>
        {
            tweetContextModal.visible &&
            <Modal context={tweetContextModal} close={() => setTweetContextModal({visible: false})}/>
        }
        {shareModalVisibility &&
            <ShareModal action={shareFunctionCallback} type='tweet' closeModal={() => setShareModalVisibility(false)}/>}
        <br/>
        <div className='w-full flex '>
        </div>
        {/* end of avatar  */}
        <br/>
        <div className='user-tweet-details'>
            <div className='flex '>
            </div>
            <div className='recent-tweets'>
                <div className='justify-center'>
                    <div className='carousel carousel-vertical rounded-box all-tweet-list'>
                        {actualTweetData.map((data) => {
                                const index = Math.random().toString(36).substring(7);

                                return (<div className='carousel-item recent-tweet' key={index}>
                                    <div className={getClassName(data.sentiment)}>
                                        <div className='warning-banner'>
                                            <div
                                                className='flex justify-center items-center h-10 w-full my-10'
                                                id={index + "_tweet-sentiment"}
                                            >
                                                <SentimentSearchResults emotion={data.sentiment} key={data.id}/>
                                            </div>
                                        </div>
                                        {/*<Tooltip anchorId={index + '_tweet-sentiment'}*/}
                                        {/*         content={'Sentiment of this tweet is ' + data.sentiment}*/}
                                        {/*/>*/}
                                        <div className='avatar-username'>
                                            <div className='avatar'>
                                                <img
                                                    src={tweetDp}/>
                                            </div>
                                            <div className='username-box'>
                                                <span className='name'>
                                                 {actualUserData.name}
                                                </span>
                                                <p className='username'>
                                                    {actualUserData.username}
                                                </p>
                                            </div>
                                        </div>
                                        <div className='tweet'
                                             onClick={() => openTweetContext(data)}>
                                            <span id={index + "_tweet-context"}>{data.tweet}</span>
                                        </div>
                                        <div className='tweet-info float-right'>
                                            {canSave && <div className='chart-action' title='Save Tweet'
                                                             onClick={() => saveTweet(data)}>
                                                <IoSave className='saveChart cursor-pointer'/>
                                            </div>}
                                            {canShare && <div className='chart-action' title='Share Tweet'
                                                              onClick={() => shareTweet(data)}>
                                                <ImShare className='saveChart cursor-pointer'/>
                                            </div>}
                                        </div>
                                        {<Tooltip anchorId={index + '_tweet-context'}
                                                  content={data?.context && data?.context.length > 0 ? 'Click to see the tweet context' : 'No context available'}/>}
                                    </div>
                                </div>)
                            }
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>);
}