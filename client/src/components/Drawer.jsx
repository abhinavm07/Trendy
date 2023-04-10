import {FaHamburger} from 'react-icons/fa'
import {IoGitCompare, IoHappy, IoHelp, IoSettingsOutline} from 'react-icons/io5'
import {Link, Route, Routes} from "react-router-dom";
import LoginRegister from "../pages/LoginRegister.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import DashBoard from "../pages/Dashboard.jsx";
import TrackUser from "../pages/TrackUser.jsx";
import Home from "../pages/Home.jsx";
import ComparingUsers from "../pages/ComparingUsers.jsx";
import UserAnalytics from "../pages/UserAnalytics.jsx";
import UnderConstruction from "./UnderConstruction.jsx";
import {useSelector} from "react-redux";
import {ImUser, IoMdAnalytics} from "react-icons/all.js";
import Navigation from "./Navigation.jsx";
import Router from "./Router.jsx";

const Drawer = () => {
    const {user} = useSelector((state) => state.auth)
    const sideBar = [
        {
            name: 'User Analytics',
            icon: <IoMdAnalytics/>,
            path: '/analytics'
        },
        {
            name: 'Track User',
            icon: <ImUser/>,
            path: '/trackuser'
        },
        {
            name: 'Comparision',
            icon: <IoGitCompare/>,
            path: '/comparision'
        },
        {
            name: 'Sentiment Analysis',
            icon: <IoHappy/>,
            path: '/sentiment'
        },
        {
            name: 'Support',
            icon: <IoHelp/>,
            path: '/support',
            disabled: true
        },
        {
            name: 'Setting',
            icon: <IoSettingsOutline/>,
            path: '/setting',
            disabled: true
        }
    ];

    return (
        <div className='drawer drawer-mobile flex'>
            {user && <div className='drawer-side'>
                <label htmlFor='my-drawer-2' className='drawer-overlay'></label>
                <Navigation items={sideBar}/>
            </div>}
            <div className='drawer-content'>
                <Router/>
            </div>
        </div>
    )
}

export default Drawer
