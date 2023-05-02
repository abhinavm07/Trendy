import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {
    getTrendCountries,
    resetCountries,
    resetTrends,
    getTrends,
    getNearMeT, resetNearTrends
} from '../features/trends/trendSlice.js'
import {toast} from "react-toastify";
import Spinner from "../components/Spinner.jsx";
import SearchBar from "../components/SearchBar.jsx";
import {IoSearch, CiTwitter, IoOpen} from "react-icons/all.js";
import {Charts} from "../components/Charts.jsx";
import {formatNumber} from "../features/helpers.js";
import SentimentSearchResults from "../components/SentimentSearchResults.jsx";
import ActionBox from "../components/ActionBox.jsx";


const DashBoard = () => {
    const {user} = useSelector((state) => state.auth)

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [geoPosition, setGeoPosition] = useState({
        lat: null,
        long: null,
    });

    const [countryName, setCountryName] = useState('Worldwide')

    const [formData, setFormData] = useState({
        searchValue: '',
    })

    let selectedCountry = null;

    const {countries, isLoadingCountry, isErrorCountry, isSuccessCountry, messageCountry} = useSelector((state) => {
        return state.countries
    })

    const {trends, isErrorTrends, isLoadingTrends, isSuccessTrends, messageTrends} = useSelector((state) =>
        state.countryTrends
    )

    const {nearTrends, isErrorNear, isLoadingNear, isSuccessNear, messageNear} = useSelector((state) =>
        state.nearMeTrends
    )

    const [actionBoxSettings, setActionBoxSettings] = useState({
        visible: false
    });

    function changeCountry(e) {
        selectedCountry = e.target.value;
        dispatch(getTrends(selectedCountry));
        setCountryName(getCountryName(selectedCountry));
    }

    useEffect(() => {
        if (isErrorCountry || isErrorTrends || isErrorNear) {
            toast.error('Something went wrong. If this continues please refresh the page.', {
                toastId: 'error_trends',
            })
        }
        dispatch(resetCountries())
        dispatch(resetTrends())
        dispatch(resetNearTrends())
    }, [dispatch, isErrorTrends, isErrorCountry, messageTrends, messageCountry, isErrorNear, messageNear])


    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
        dispatch(getTrends("1"));
        getLocation();
        checkCountry();
    }, []);


    useEffect(() => {
        if (geoPosition.lat && geoPosition.long) {
            dispatch(getNearMeT(geoPosition))
        }
    }, [geoPosition.long, geoPosition.lat])


    function checkCountry() {
        if ((!countries || countries.length == 0 || countries.length == undefined)) {
            dispatch(getTrendCountries(''))
        }
    }

    function getCountryName(id) {
        if (id) {
            return Object.values(countries).find((country) => {
                return country['woeid'] == id
            })['name']
        }
        return '';
    }


    const onChange = (e) => {
        setFormData((prevstate) => ({
            ...prevstate,
            [e.target.name]: e.target.value,
        }))
    }

    function takeToTwitter(e) {
        e.preventDefault();
        window.open(
            `https://twitter.com/search?q=${formData.searchValue}`,
            '_blank'
        );
    }

    async function fetchSentiment(trend) {
        const trendSentiment = await fetch(`/api/routes/fetchSentiment/${trend}`, {
            method: 'GET',
        })
        return trendSentiment;
    }

    function openTrend(trend, parent) {
        const settings = {
            visible: true,
            parentId: parent,
            position: 'left',
            onOpen: async () => await fetchSentiment(trend.trend)
            ,
            onClose: () => {
                setActionBoxSettings({
                    visible: false
                })
            },
            extraOptions: {
                'open_trend': {
                    action: () => {
                        window.open(
                            trend.tweet_url,
                            '_blank'
                        );
                    },
                    label: 'Open Trend',
                    icon: <IoOpen/>,
                }
            }
        };
        setActionBoxSettings(settings);
    }


    //function to get current latitude3 and longitude
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            return "Geolocation is not supported by this browser.";
        }
    }

    function showPosition(position) {
        setGeoPosition(
            {
                lat: position.coords.latitude,
                long: position.coords.longitude
            }
        );
    }

    const locationTrendOption = {
        identifier: 'trend',
        dataKey: 'volumn',
        label: 'Trending',
    };

    const extraOptions = {
        width: '100px',
        height: '40%',
        canExport: true,
        canShare: true,
        canSave: true,
    }

    return (
        <div className='sidecontainer'>
            {actionBoxSettings?.visible && <ActionBox settings={actionBoxSettings}/>}
            <SearchBar
                onSubmit={takeToTwitter}
                value={formData.searchValue}
                onChange={onChange}
                name='searchValue'
                id='tweetSearch'
                placeholder='Search on Twitter'
                disabled={!formData.searchValue}
                type='text'
                icon={<CiTwitter/>}
                buttonIcon={<IoSearch/>}
            />
            <div className='countryDropdownBox float-right mb-10'>
                <select className='input input-bordered' onChange={changeCountry} defaultValue={selectedCountry}
                        onClick={checkCountry}>
                    <option value=''>Select Country</option>
                    {isLoadingCountry && <option value=''>Loading...</option>}
                    {countries && Object.values(countries).map((country, index) => (
                        <option key={index} value={country['woeid']}>{country['name']}</option>
                    ))}
                </select>
            </div>
            {
                ///if isLoadingTrends or isLoadingNear runs for more than 30 seconds, close spinner and show error
                (
                    (isLoadingTrends || isLoadingNear || isLoadingCountry) &&
                    <Spinner waitFor={30} error={trends?.message || nearTrends?.message} forceRefresh/>
                )
            }
            <div className='d-flex flex-row trendboxes justify-content-between clear-both'>
                <div className='tweetbox mt-5 trendbox'>
                    {(trends && !isLoadingTrends && !isErrorTrends && countryName) ?
                        (<>
                            <div className='tweetbox-title'>Trending in {countryName}</div>
                            <Charts chartOptions={locationTrendOption} data={trends} extraOptions={extraOptions}/></>)
                        :
                        (
                            <div className=''>Please select a country to see the trends there.</div>
                        )
                    }
                </div>
                <div></div>
                {nearTrends && !isLoadingNear && !isErrorNear && !nearTrends?.message &&
                    <div className='tweetbox mt-5 trendbox sidetrend'>
                        <>
                            <div className='tweetbox-title'>Around You</div>
                            {Object.values(nearTrends).map((nearMe, index) => (
                                (nearMe?.trend &&
                                    <div key={index}>
                                        <div key={index} className='individualTrends flex'
                                             onClick={() => openTrend(nearMe, `side_trend_${index}`)}
                                             id={'side_trend_' + index}>
                                            <a href='#'
                                            >{nearMe['trend']}<span
                                                className='tweetVolume'> {formatNumber(nearMe.volume)} Tweets</span></a>
                                        </div>
                                    </div>)
                            ))}
                        </>
                    </div>}
            </div>
        </div>
    )
}

export default DashBoard
