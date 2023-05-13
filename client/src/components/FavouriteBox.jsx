import {Charts} from "./Charts.jsx";
import Modal from "./Modal.jsx";
import React, {useState} from "react";
import {dateToString} from "../features/helpers.js";
import TweetBox from "./TweetBox.jsx";
import {useDispatch} from "react-redux";
import {getSharedContents, shareContent} from "../features/favourites/favouriteSlice.js";
import {toast} from "react-toastify";
import ActionBox from "./ActionBox.jsx";

export default function FavouriteBox({component, contents}) {
    const {charts, shared, tweets} = contents;
    const {name, dataKey, content} = component;
    const dispatch = useDispatch();

    const isChart = dataKey === 'charts';
    const isTweet = dataKey === 'tweets';
    const isShared = dataKey === 'shared';
    const isAll = dataKey === 'all';

    function getExtraOptions(chart) {
        return {height: '400', width: '700', canSave: false, canExport: true, canShare: true, id: chart._id}
    }

    const [favModalSetting, setFavModalSetting] = useState({
        visible: false,
        title: 'Opening Saved....',
        body: '',
    });

    function openSaved(context) {
        const {chartTitle = dateToString(context.createdAt)} = context?.chartsOptions && JSON.parse(context.chartsOptions);
        setFavModalSetting({
            visible: true,
            title: chartTitle,
            body: generateChart(context)
        });
    }

        function openSavedTweet(context) {
        setFavModalSetting({
            visible: true,
            body: context
        });
    }

    function generateChart(context) {
        return context?.chartsOptions &&
            <Charts chartOptions={JSON.parse(context.chartsOptions)} data={context.data}
                    extraOptions={getExtraOptions(context)}/>
    }

    const [actionBoxSettings, setActionBoxSettings] = useState({});

    function openTrend(data, parent) {
        const settings = {
            visible: true,
            parentId: parent,
            position: 'left',
            onClose: () => {
                setActionBoxSettings({
                    visible: false
                })
            },
            content: <span className='shared-subtitle'>Shared by {data?.sharedBy} on {dateToString(data.createdAt)}</span>,
        };
        setActionBoxSettings(settings);
    }

    const hasContent = (dataKey === 'all' && (charts.length || tweets.length || shared.length)) || (dataKey !== 'all' && contents[dataKey].length);
    const hasShared = isShared && (shared?.charts?.length || shared?.tweets?.length);

    return (
        <div className='flex flex-col'>

            {actionBoxSettings?.visible && <ActionBox settings={actionBoxSettings}/>}

            <div
                className='text-gray-400 subpixel-antialiased text-sm mb-5'>{(hasContent || hasShared) ? content : 'Oppsss.. its empty'}</div>
            <div className='flex flex-wrap fav-container pb-10'>
                {(isChart || isAll) && charts.map((chart) => {
                        return <>
                            {chart?.chartsOptions &&
                                <div className='fav-box cursor-pointer flex flex-col' onClick={() => openSaved(chart)}>
                                    <div className='fav-chart-img-box'></div>
                                    <div
                                        className='fav-title'>{JSON.parse(chart.chartsOptions).chartTitle} ({dateToString(chart.createdAt)})
                                    </div>
                                </div>}
                        </>
                    }
                )
                }
                {isShared && shared?.charts.map((chart) => {
                        const {savedData} = chart;
                        return savedData.map((data, index) => {
                            return <>
                                {data?.chartsOptions &&
                                    <div key={index} className='shared-box cursor-pointer flex flex-col p-5'
                                         id={`sharedChart_${index}`}
                                         onClick={() => openSaved(data)}
                                         onMouseEnter={() => openTrend(chart,`sharedChart_${index}`)}
                                         onMouseLeave={() => setActionBoxSettings({visible: false})}
                                    >
                                        <div className='fav-chart-img-box'></div>
                                        <span className='shared-subtitle'>
                                        {JSON.parse(data.chartsOptions).chartTitle} ({dateToString(data.createdAt)})
                                    </span>

                                    </div>}
                            </>
                        })
                    }
                )}

                

            </div>
                                {isShared && shared?.tweets.map((tweet) => {
                        const {savedData} =tweet;
                        return savedData.map((data, index) => {
                            return <>
                                {data?.tweet &&
                                    <div key={index} className='recent-tweet'
                                         id={`sharedChart_${index}`}
                                         onClick={() => openSavedTweet(data)}
                                         onMouseEnter={() => openTrend(tweet,`sharedTweet_${index}`)}
                                         onMouseLeave={() => setActionBoxSettings({visible: false})}
                                    >
                                                        <div className='justify-center'>
                                                            <div className='carousel carousel-vertical rounded-box all-tweet-list'>
                    <>
                        <TweetBox content={data} canSave={false} canShare={true}/>
                    </>
</div>
                                                        </div>
                                                                            
                                    </div>}
                            </>
                        })
                    }
                )}

            {isAll && <div className='mb-10'></div>}
            {favModalSetting.visible &&
                <Modal context={favModalSetting} close={() => setFavModalSetting({visible: false})}/>}
            <div className='tweetBoxSaved'>
                {(isTweet || isAll) && tweets.map((tweet) => (
                    <>
                        <TweetBox content={tweet} canSave={false} canShare={true}/>
                    </>
                ))}
            </div>
        </div>
    )
};