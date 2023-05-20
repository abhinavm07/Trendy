import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import Table from "../components/Table.jsx";
import {listUsers, toggleAdmin, toggleAccountStatus} from "../features/settings/settingsSlice.js";
import {toast} from "react-toastify";
import {AiFillEyeInvisible, ImEye, AiOutlineUserDelete, AiOutlineUserAdd, BiReset} from "react-icons/all.js";
import {forgotPassword} from "../features/auth/authSlice.js";

const SettingsPage = () => {
    const dispatch = useDispatch();
    const [userLists, setUserLists] = useState([]);

    async function resetUserPassword({email}) {
        const userData = {email}
        const response = await dispatch(forgotPassword(userData))
        if (response.payload) {
            toast[response.payload.status](response.payload.msg);
            if (response.payload.status === 'success') {
                await getUsers();
            }
        }
    }

    async function toggleAdminAccess(item) {
        const response = await dispatch(toggleAdmin(item.email));
        if (response.payload) {
            toast[response.payload.status](response.payload.msg);
            if (response.payload.status === 'success') {
                await getUsers();
            }
        }
    }

    async function toggleAccount(item) {
        const response = await dispatch(toggleAccountStatus(item.email));
        if (response.payload) {
            toast[response.payload.status](response.payload.msg);
            if (response.payload.status === 'success') {
                await getUsers();
            }
        }
    }

    async function getUsers() {
        const response = await dispatch(listUsers())
        setUserLists(response.payload);
    }

    useEffect(() => {
        if (!userLists?.length) {
            getUsers();
        }
    }, [])

    const settingsTable = {
        data: userLists || [],
        header: ['Name', 'Email', 'Created At'],
        dataKeys: ['name', 'email', 'createdAt::datetime'],
        canExport: true,
        actions: [
            {
                name: <AiFillEyeInvisible/>,
                tooltip: 'Suspend Account',
                onClick: async (item) => {
                    await toggleAccount(item);
                },
                hideWhen: 'isDeleted::true'
            },
            {
                name: <ImEye/>,
                tooltip: 'Activate Account',
                onClick: async (item) => {
                    await toggleAccount(item);
                },
                hideWhen: 'isDeleted::false'
            },
            {
                name: <AiOutlineUserDelete/>,
                tooltip: 'Revoke Admin Access',
                onClick: async (item) => {
                    await toggleAdminAccess(item);
                },
                hideWhen: 'isAdmin::false'
            },
            {
                name: <AiOutlineUserAdd/>,
                tooltip: 'Give Admin Access',
                onClick: async (item) => {
                    await toggleAdminAccess(item);
                },
                hideWhen: 'isAdmin::true'
            },
            {
                name: <BiReset/>,
                tooltip: 'Reset Password',
                onClick: async (item) => {
                    await resetUserPassword(item);
                },
            },
        ]
    }

    return (
        <>
            <Table tableConfig={settingsTable}/>
        </>
    );
};

export default SettingsPage;
