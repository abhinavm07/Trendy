import {IoGitCompare, IoHappy, IoHelp, IoHome, IoSave, IoSettingsOutline} from 'react-icons/io5'
import {useSelector} from "react-redux";
import {ImUser, IoMdAnalytics} from "react-icons/all.js";
import Navigation from "./Navigation.jsx";
import Router from "./Router.jsx";
import {useState} from "react";
import {useLocation} from "react-router-dom";

const Drawer = () => {
    const {user} = useSelector((state) => state.auth)
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
            name: 'Favourites',
            icon: <IoSave/>,
            path: '/favourites'
        },
        {
            name: 'Sentiment Analysis',
            icon: <IoHappy/>,
            path: '/sentiment'
        },
        {
            name: 'Track User',
            icon: <ImUser/>,
            path: '/trackuser',
            disabled: true
        },
        {
            name: 'Comparison',
            icon: <IoGitCompare/>,
            path: '/comparison',
            disabled: true
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
    const location = useLocation();

    function getPageTitle() {
        const path = location.pathname;

        if(location.pathname == '' || location.pathname == '/'){
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
            <div className='pageTitle'>
                {getPageTitle()}
            </div>
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
