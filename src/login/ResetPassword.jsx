import React, {useState, useEffect} from 'react';
import {NavLink} from 'react-router-dom';
import './Email.css';
import {serverURL} from '../api/URL';
import {ReactComponent as Activation} from '../img/activation.svg';
import {ReactComponent as ActivationNo} from '../img/activation-no.svg';
import axios from "axios";

function ResetPassword() {
    const [resetPasswordState, setResetPasswordState] = useState(0);
    useEffect( () => {
        async function resetPassword() {
            const href = window.location.pathname.split('/');
            const secret = href[href.length - 1];

            try {
                const res = await axios.post(`${serverURL}/reset`, {secret});
                console.log(res);
                res.status === 200 && setResetPasswordState(1);
            } catch (e) {
                setResetPasswordState(2);
            }
        }
        resetPassword().then()
    },[]);
    return <div className='email-window'>
        {resetPasswordState === 0 && <div className='spinner'>
            <div className='loader'>Loading...</div>
        </div>}
        <div className='email-window-wrapper'>
            {resetPasswordState === 1 && <>
                    <Activation/>
                    <div>
                        <h3>New password was generated</h3>
                        <br/>
                        It has been sent to your email
                    </div>
                    <NavLink to='/'>Back to main page</NavLink>
                </>}
            {resetPasswordState === 2 && <>
                    <ActivationNo/>
                    <h1>
                    OOPS !
                        <br/>
                    SOMETHING WENT WRONG!
                    </h1>
                </>}
        </div>
    </div>
}

export default ResetPassword;