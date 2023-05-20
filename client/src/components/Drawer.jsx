import {IoGitCompare, IoHappy, IoHelp, IoHome, IoSave, IoSettingsOutline} from 'react-icons/io5'
import {useSelector} from "react-redux";
import {ImEye, ImUser, IoMdAnalytics} from "react-icons/all.js";
import Navigation from "./Navigation.jsx";
import Router from "./Router.jsx";
import {useState} from "react";
import {useLocation} from "react-router-dom";

const Drawer = () => {
    const {user} = useSelector((state) => state.auth)
    let isAdmin = false;
    if (user) {
        isAdmin = user.isAdmin;
    }
    const sideBar = [
        {
            name: 'Dashboard',
            icon: <IoHome/>,
            path: '/dashboard'
        },
        {
            name: 'User Analytics',
            icon: <IoMdAnalytics/>,
            path: '/analytics'
        },
        {
            name: 'Saved',
            icon: <IoSave/>,
            path: '/favourites'
        },
        {
            name: 'Sentiment Analysis',
            icon: <IoHappy/>,
            path: '/sentiment'
        },
        {
            name: 'Watchlist',
            icon: <ImEye/>,
            path: '/watchlist',
        },
        {
            name: 'Comparison',
            icon: <IoGitCompare/>,
            path: '/comparison',
        },
        // {
        //     name: 'Support',
        //     icon: <IoHelp/>,
        //     path: '/support',
        //     disabled: true
        // },
        {
            name: 'Setting',
            icon: <IoSettingsOutline/>,
            path: '/setting',
            hidden: !isAdmin
        }
    ];
    const location = useLocation();

    function getPageTitle() {
        const path = location.pathname;

        if (location.pathname == '' || location.pathname == '/') {
            return 'Dashboard'
        }
        //from sideBar array find the object with the path that matches the current path
        const page = sideBar.find((item) => item.path === path);
        //if page is found return the name of the page
        if (page) {
            return page.name;
        }
        //if page is not found return an empty string
        return '';
    }

    return (
        <>
            <div className='drawer drawer-mobile flex'>
                {user && <div className='drawer-side'>
                    <label htmlFor='my-drawer-2' className='drawer-overlay'></label>
                    <Navigation items={sideBar}/>
                </div>}
                <div className='drawer-content'>
                    <Router/>
                </div>
            </div>
        </>
    )
}

export default Drawer
