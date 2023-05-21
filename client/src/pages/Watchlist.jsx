import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {getOldTrackings, toggleTracking} from "../features/tracking/trackingSlice.js";
import Table from "../components/Table.jsx";
import Spinner from "../components/Spinner.jsx";
import {toast} from "react-toastify";
import Modal from "../components/Modal.jsx";
import {Tooltip} from "react-tooltip";
import {AiOutlinePieChart, MdOutlineNotStarted, AiOutlinePauseCircle, ImEye} from "react-icons/all.js";
import {Charts} from "../components/Charts.jsx";

export default function Watchlist() {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        getWatch();
    }, []);

    function getWatch() {
        setLoading(true);
        dispatch(getOldTrackings()).then((res) => {
            setWatchlist(res.payload);
            setLoading(false);
        });
    }

    const tableConfig = {
        data: watchlist,
        header: ['Username', 'Watching Since', 'Last Updated'],
        dataKeys: ['trackedUser', 'createdAt::datetime', 'updatedAt::datetime'],
        actions: [
            {
                name: <AiOutlinePauseCircle/>,
                tooltip: 'Suspend Tracking',
                onClick: async (item) => {
                    const response = await dispatch(toggleTracking(item));
                    if (response.payload) {
                        toast[response.payload.status](response.payload.msg);
                        if (response.payload.status === 'success') {
                            getWatch();
                        }
                    }
                },
                hideWhen: 'trackingStatus::false'
            },
            {
                name: <MdOutlineNotStarted/>,
                tooltip: 'Resume Tracking',
                onClick: async (item) => {
                    const response = await dispatch(toggleTracking(item));
                    if (response.payload) {
                        toast[response.payload.status](response.payload.msg);
                        if (response.payload.status === 'success') {
                            getWatch();
                        }
                    }
                },
                hideWhen: 'trackingStatus::true'
            },
            {
                name: <AiOutlinePieChart/>,
                tooltip: 'View Content Breakdown',
                onClick: (item) => {
                    setTweetBreakdownModal({
                        visible: true,
                        title: 'Tracked Content Breakdown',
                        body: getIndividualBreakdown(item?.contextVolume),
                    });
                }
            }
        ],
        rowClick: (item) => {
            setModal({
                visible: true,
                title: `Tweet History`,
                body: generateTweetTable(item),
            });
        }
    };

    const tweetHistoryTable = (item) => {
        return {
            data: item.twtData,
            header: ['Tweet', 'Sentiment', 'Context'],
            dataKeys: ['tweet', 'sentiment', 'context'],
            tableStyle: {
                height: '50vh',
                overflow: 'scroll'
            },
            rowType: {
                'context': 'Chips'
            }
        }
    };

    function generateTweetTable(item) {
        return <Table tableConfig={tweetHistoryTable(item)}/>;
    }

    const [modal, setModal] = useState({
        visible: false,
    });

    const [tweetBreakdownModal, setTweetBreakdownModal] = useState({
        visible: false,
        title: 'Tracked Content Breakdown',
        body: '',
    });

    function getBreakdownChart(data) {
        const chartData = [];
        data.forEach((item) => {
            if (item.contextVolume) {
                item.contextVolume.forEach((context) => {
                    Object.keys(context).forEach((key, value) => {
                        if (chartData[key]) {
                            chartData[key] += value;
                        } else {
                            chartData[key] = value;
                        }
                    });
                })
            }
        })

        const breakDownOptions = {
            label: 'Count',
            chartTitle: `Breakdown of Tracked Tweets`,
        };
        return <Charts data={chartData} chartOptions={breakDownOptions}
                       extraOptions={{chartType: 'pie', canExport: true}}/>
    }

    function getIndividualBreakdown(item) {
        const label = Object.keys(item[0]);
        const breakDownOptions = {
            label: 'Count',
            chartTitle: `Breakdown of Individual Tracked Users`,
        }
        return <Charts data={item[0]} labels={label} chartOptions={breakDownOptions} extraOptions={{
            chartType: 'pie',
            canExport: true,
            width: 50,
            height: 50
        }}/>
    }


    return (
        <div className='flex flex-col'>
            {loading && <Spinner/>}
            <Tooltip anchorId='tweet-breakdown-chart-tooltip'
                     content='Click here to see tracked tweets breakdown'/>
            <div className="watchlist-header ml-auto mb-5">
                <div className='flex flex-col user-detail-small' id='tweet-breakdown-chart-tooltip'
                     onClick={() => setTweetBreakdownModal({
                         visible: true,
                         title: 'Tweets Context Breakdown',
                         body: getBreakdownChart(watchlist),
                     })}>
                    <ImEye/>
                </div>
            </div>
            {tweetBreakdownModal.visible &&
                <Modal context={tweetBreakdownModal} close={() => setTweetBreakdownModal({visible: false})}/>}
            {modal.visible && <Modal context={modal} close={() => setModal({visible: false})}/>}
            <Table tableConfig={tableConfig}/>
        </div>
    )
}