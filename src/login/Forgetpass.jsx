import React, {useState} from 'react';
import axios from "axios";
import {serverURL} from "../api/URL";
import {ReactComponent as Cross} from "../img/cross.svg";

const ForgetPass = ({setPopUpState}) => {
    const [emailState, setEmailState] = useState('');
    const [modalState, setModalState] = useState(false);
    const [modalWrongUserState, setModalWrongUserState] = useState(false);
    const [isSendingReq, setReqStatus] = useState(false)

    async function postUserEmail (email) {
        return await axios.post(`${serverURL}/forget`,
            {email},
        )
    }

    function handleChange (event) {
        setEmailState(event.target.value)
    }
    function handleSubmit (event) {
        event.preventDefault();
        setReqStatus(true)
        async function checkUserEmail () {
            const res = await postUserEmail(emailState);
            if (res.data === 'OK') {
                window.addEventListener('keydown', (event) => {if (event.keyCode === 27) handleClick()});
                setReqStatus(false)
                setModalState(true);
            } else {
                setReqStatus(false)
                window.addEventListener('keydown', (event) => {if (event.keyCode === 27) handleOkClick()});
                setModalWrongUserState(true)
            }
        }
        checkUserEmail().then();
    }
    function handleClick () {
        window.removeEventListener('keydown', (event) => {if (event.keyCode === 27) handleClick()});
        setPopUpState(true,0);
    }
    function handleOkClick () {
        window.removeEventListener('keydown', (event) => {if (event.keyCode === 27) handleOkClick()});
        setModalWrongUserState(false);
    }

    return (
        <div className='forget-pass'>
            <form onSubmit={handleSubmit}>
                <div className='logo'>Recover password</div>
                <div className='login-form-input-name'>
                    Email
                </div>
                <input
                    className='login-form-input'
                    type='email'
                    name='email'
                    value={emailState.email}
                    onChange={handleChange}
                    required
                    autocomplete="off"
                />
                <button type='submit' className={`login-button forgetPass-button ${isSendingReq && 'login-button-disabled'}`}
             disabled={isSendingReq}>{isSendingReq ? 'Processing' : 'Send email'}</button>
            </form>
            <div className='change-page' onClick={() => setPopUpState(true,0)}>
                Back to login
            </div>
            <br/>
            <br className='forget-pass-br'/>
            <div className='change-page' onClick={() => setPopUpState(true,2)}>
                Registration
            </div>
            {modalState && <div className='login-modal'>
                <div className='login-modal-window'>
                    <div className='login-modal-window-close' onClick={() => setModalState(false)}>
                        <Cross/>
                    </div>
                    <div className='login-modal-window-data'>
                        Link for password recover was sent to the email
                    </div>
                    <button className='login-button' onClick={handleClick}>
                        Back to login
                    </button>
                </div>
            </div>}
            {modalWrongUserState && <div className='login-modal'>
                <div className='login-modal-window'>
                    <div className='login-modal-window-close' onClick={handleOkClick}>
                        <Cross/>
                    </div>
                    <div className='login-modal-window-data'>
                        Such user does not exist
                    </div>
                    <button className='login-button' onClick={handleOkClick}>
                        OK
                    </button>
                </div>
            </div>}
        </div>
    );
};

export default ForgetPass;