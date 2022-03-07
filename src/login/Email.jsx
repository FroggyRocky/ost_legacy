import React, {useState, useEffect} from 'react';
import {NavLink} from 'react-router-dom';
import './Email.css';
import {serverURL} from '../api/URL';
import {ReactComponent as Activation} from '../img/activation.svg';
import {ReactComponent as ActivationNo} from '../img/activation-no.svg';
import axios from "axios";

function Email() {
    const [emailState, setEmailState] = useState(0);
    useEffect( () => {
        async function confirmEmail() {
            const href = window.location.pathname.split('/');
            const secret = href[href.length - 1];
            try {
                const res = await axios.post(`${serverURL}/email`, {secret});
                console.log(res);
                res.status === 200 && setEmailState(1);
            } catch (e) {
                setEmailState(2);
            }
        }
        confirmEmail().then()
    },[]);
    return <div className='email-window'>
        {emailState === 0 && <div className='spinner'>
            <div className='loader'>Loading...</div>
        </div>}
        <div className='email-window-wrapper'>
            {emailState === 1 && <>
                    <Activation/>
                    <div>
                        <h3>Your Email Address has been confirmed.</h3>
                        <br/>
                        Please check your email address till we approve your account.
                        If you do not receive the email during 24 hours please check your spam filter or contact us.
                    </div>
                    <NavLink to='/'>Back to main page</NavLink>
                </>}
            {emailState === 2 && <>
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

export default Email;