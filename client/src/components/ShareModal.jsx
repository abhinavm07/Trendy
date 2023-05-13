import {useEffect, useState} from "react";
import Modal from "./Modal.jsx";
import {ImShare, IoSearch, MdEmail} from "react-icons/all.js";
import {toast} from "react-toastify";

export default function ShareModal({type = 'tweet', action}) {
    let userEmail = '';
    const handleChange = (e) => {
        userEmail = e.target.value;
    }

    function callBack(e) {
        e.preventDefault();
        if(!userEmail) {
            toast.info('Please enter email address');
        };
        action(userEmail);
    }

    function generateShareForm() {
        return (
            <form onSubmit={callBack} className='w-full'>
                <div className='form-group'>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="icon-text-input" id="basic-addon1"><MdEmail/></span>
                        </div>
                        <input
                            type='email'
                            placeholder='Enter Email'
                            name='userEmail'
                            id='userEmail'
                            //value={userEmail}
                            onChange={handleChange}
                            className='input  input-info'
                        />
                        <div className='input-group-append'>
                            <button type='submit' className='btn searchButton'>
                                <ImShare/>
                            </button>
                        </div>
                    </div>
                </div>

            </form>
        );
    }

    const [modalSetting, setModalSetting] = useState({
        visible: true,
        title: `Share ${type}`,
        body: generateShareForm(),
    });
    return (<>
        {modalSetting.visible && <Modal context={modalSetting} close={() => setModalSetting({visible: false})}/>}
    </>);

}