import React, {useEffect, useState} from 'react'
import {toast} from "react-toastify";

function Spinner({
                     waitFor = null,
                     error = 'Your request took longer than usual, please try again later.',
                     forceRefresh = false
                 }) {
    const [seconds, setSeconds] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    //function to create a second countdown
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(seconds => seconds + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    function showError() {
        if (!isRefreshing && waitFor) {
            toast.error(error, {
                    toastId: 'error_spinner',
                }
            )
        }

        //if forceRefresh is true, then the page will be refreshed in 5 seconds
        if (forceRefresh) {
            //close old toast after 2 seconds
            setTimeout(() => {
                toast.dismiss('error_spinner')
                setIsRefreshing(true);
            }, 2000)

            toast.error('Page will now refresh in 5 seconds.', {
                    toastId: 'error_spinner_refresh',
                }
            )

            setTimeout(() => {
                window.location.reload();
            }, 5000)
        }
    }

    return (
        <>
            {!waitFor || (waitFor && waitFor >= seconds) ? <div className='loadingSpinnerContainer'>
                <div className='loadingSpinner'></div>
            </div> : showError()}
        </>
    )
}

export default Spinner
