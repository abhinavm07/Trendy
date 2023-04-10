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
import {IoSearch, CiTwitter} from "react-icons/all.js";
import {Charts} from "../components/Charts.jsx";


const DashBoard = () => {
    const {user} = useSelector((state) => state.auth)

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [geoPosition, setGeoPosition] = useState({
        lat: null,
        long: null,
    });

    const [countryName, setCountryName] = useState('')

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

    function changeCountry(e) {
        selectedCountry = e.target.value;
        dispatch(getTrends(selectedCountry));
        setCountryName(getCountryName(selectedCountry));
    }

    useEffect(() => {
        if (isErrorCountry || isErrorTrends || isErrorNear) {
            toast.error(messageTrends || messageCountry || messageNear)
        }
        dispatch(resetCountries())
        dispatch(resetTrends())
        dispatch(resetNearTrends())
    }, [dispatch, isErrorTrends, isErrorCountry, messageTrends, messageCountry, isErrorNear, messageNear])


    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
        getLocation();
        checkCountry();
    }, []);


    useEffect(() => {
        dispatch(getNearMeT(geoPosition))
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

    return (
        <div className='sidecontainer'>
            <SearchBar
                onSubmit={takeToTwitter}
                value={formData.searchValue}
                onChange={onChange}
                name='searchValue'
                id='tweetSearch'
                placeholder='Search Tweets'
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
                (isLoadingTrends || isLoadingNear) && <Spinner/>
            }
            {trends && !isLoadingTrends && !isErrorTrends && countryName &&
                <div className='tweetbox clear-both mt-5 trendbox'>
                    <div className='tweetbox-title'>Trending in {countryName}</div>
                    <Charts chartOptions={locationTrendOption} data={trends}/>
                </div>}
            {nearTrends && !isLoadingNear && !isErrorNear && !nearTrends?.message &&
                <div className='tweetbox clear-both mt-5 trendbox'>
                    <>
                        <div className='tweetbox-title'>Trending in your area</div>
                        {Object.values(nearTrends).map((nearMe, index) => (
                            (nearMe?.trend && <div key={index} className='individualTrends'>
                                <a href={nearMe.tweet_url}
                                   target='_blank'>{nearMe['trend']}</a>
                            </div>)
                        ))}
                    </>
                </div>}
        </div>
    )
}

export default DashBoard
