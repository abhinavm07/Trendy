import React, {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {getSavedCharts, getSavedTweets, getSharedContents} from "../features/favourites/favouriteSlice.js";
import Spinner from "../components/Spinner.jsx";
import FavouriteBox from "../components/FavouriteBox.jsx";

export default function Favourites() {
    const [favourites, setFavourites] = useState(null);

    const tabs = [
        {
            name: 'All Saved',
            content: 'All your favourites in one place',
            dataKey: 'all'
        },
        {
            name: 'Charts',
            content: 'Your saved charts',
            dataKey: 'charts'
        },
        {
            name: 'Tweets',
            content: 'Your saved tweets',
            dataKey: 'tweets'
        },
        {
            name: 'Shared',
            content: '',
            dataKey: 'shared'
        }
    ];

    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    useEffect(() => {
        async function fetchData() {
            if (!favourites) {
                setIsLoading(true)
                const savedCharts = await dispatch(getSavedCharts());
                const savedTweets = await dispatch(getSavedTweets());
                const sharedContents = await dispatch(getSharedContents());
                const savedFav = {
                    charts: savedCharts.payload,
                    tweets: savedTweets.payload,
                    shared: sharedContents.payload,
                };
                setFavourites(savedFav);
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);
    return (
        <div className='sidecontainer flex flex-col mr-16'>
            {isLoading && <Spinner/>}
            <div className='flex flex-col'>
                <div className='flex flex-row'>
                    {tabs.map((tab) => (
                        <div key={tab.name}
                             className={`flex items-center justify-center  cursor-pointer ${activeTab.name === tab.name ? 'active-fav-tab' : 'normal-fav-tab'}`}
                             onClick={() => setActiveTab(tab)}>
                            {tab.name}
                            <div className='count-fav'>
                                {tab.dataKey === 'all' && favourites && favourites.charts && favourites.tweets && favourites.charts.length + favourites.tweets.length}
                                {tab.dataKey === 'charts' && favourites && favourites.charts && favourites.charts.length}
                                {tab.dataKey === 'tweets' && favourites && favourites.tweets && favourites.tweets.length}
                                {tab.dataKey === 'shared' && favourites && favourites?.shared && favourites?.shared?.tweets?.length + favourites?.shared?.charts?.length}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='flex mt-5 pl-5'>
                {favourites && <FavouriteBox component={activeTab} contents={favourites}/>}
            </div>
        </div>
    );
}