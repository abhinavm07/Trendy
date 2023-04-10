import React, {useEffect} from 'react'
import {useSelector} from "react-redux";
import {useNavigate } from "react-router-dom";


const DashBoard = () => {
    const {user} = useSelector((state) => state.auth)
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, []);

    return (
        <>
            <div></div>
        </>
    )
}

export default DashBoard
