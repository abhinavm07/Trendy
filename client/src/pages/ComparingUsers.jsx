import React, {useState} from 'react'
import SearchBar from "../components/SearchBar.jsx";
import {IoSearch} from "react-icons/all.js";
import Table from "../components/Table.jsx";
import {Charts} from "../components/Charts.jsx";
import {useDispatch} from "react-redux";
import {compareUsers} from "../features/compareUsers/compareUsersSlice.js";
import Spinner from "../components/Spinner.jsx";

const ComparingUsers = () => {
    const [users, setUsers] = useState({
        userOne: '',
        userTwo: '',
    })

    const [userData, setUserData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const onChange = (e) => {
        setUsers((prevstate) => ({
            ...prevstate,
            [e.target.name]: e.target.value,
        }))
    }

    const dispatch = useDispatch();

    async function onSubmit() {
        setIsLoading(true);
        const allUserData = await dispatch(compareUsers(users));

        const brokenData = {
            userOne: allUserData.payload[0][users.userOne] || allUserData.payload[0][users.userTwo],
            userTwo: allUserData.payload[1][users.userTwo] || allUserData.payload[1][users.userOne]
        }

        setUserData(brokenData);
        setIsLoading(false);
    }

    function isDisabled() {
        return !users.userOne || !users.userTwo
    }

    function hasData() {
        return userData && userData?.userOne && userData?.userTwo
    }

    const userOneTableConfig = {
        data: [userData.userOne],
        header: ['Name', 'No. of Tweets', 'Followers', 'Following', 'Context Breakdown'],
        dataKeys: ['name', 'tweet_count', 'followers_count', 'following_count', 'context'],
        rowType: {
            'context': 'Chips'
        },
        canExport: true,
    }

    const userTwoTableConfig = {
        data: [userData.userTwo],
        header: ['Name','No. of Tweets', 'Followers', 'Following', 'Context Breakdown'],
        dataKeys: ['name', 'tweet_count', 'followers_count', 'following_count', 'context'],
        tableStyle: {
            height: '50vh',
            overflow: 'scroll'
        },
        rowType: {
            'context': 'Chips'
        },
        canExport: true,
    }

    const chartData = userData;
    const chartOptions = {
        label: [users.userOne, users.userTwo],
        chartTitle: `Users Comparision`,
        isMultiple: true,
        dataKey: ['tweet_count', 'followers_count', 'following_count'],
        ignoreField: ['name', 'context', 'username', 'contextVolume'],
        chartLabels: [
            'Followers',
            'Following',
            'No. of Tweets',
        ],
    };;


    return (
        <div className='flex flex-col'>
            {isLoading && <Spinner/>}
            <div className='flex flex-col'>
                <div>
                    <SearchBar
                        value={users.userOne}
                        onChange={onChange}
                        name='userOne'
                        id='userOne'
                        placeholder='First User'
                        disabled={!users.userOne}
                        type='text'
                        icon='@'
                    />
                </div>
                <div className=''>
                    <SearchBar
                        value={users.userTwo}
                        onChange={onChange}
                        name='userTwo'
                        id='userTwo'
                        placeholder='Second User'
                        disabled={!users.userTwo}
                        type='text'
                        icon='@'
                    />
                </div>
                <div className='ml-auto'>
                    <button
                        className='btn bg-transparent
                        hover:bg-blue-500
                        text-blue-700
                        font-semibold
                        hover:text-white
                        py-2 px-4 border
                        border-blue-500
                        hover:border-transparent
                        rounded' onClick={onSubmit} disabled={isDisabled()}>Compare
                    </button>
                </div>
                {hasData() && <div className='m-auto chart-compare'>
                    <h2>
                        Comparison Chart
                    </h2>
                    <Charts data={chartData} chartOptions={chartOptions}
                            extraOptions={{chartType: 'pie', canExport: true, height: 500, width: 500}}/>
                </div>}
                {hasData() && <div className='mt-10 flex flex-row m-auto'>
                        <Table
                            tableConfig={userOneTableConfig}/>
                    <div className='ml-5'>
                        <Table
                            tableConfig={userTwoTableConfig}/>
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default ComparingUsers
