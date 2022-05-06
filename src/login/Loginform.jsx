import React, {useState, useRef} from 'react';
import {Redirect} from 'react-router-dom';
import axios from "axios";
import {serverURL} from '../api/URL';
import {ReactComponent as Cross} from '../img/cross.svg';
import {ReactComponent as Activation} from '../img/activation.svg'


const LoginForm = ({setPopUpState}) => {

    const [isSendingReq, setReqStatus] = useState(false)

    const [formState, setFormState] = useState({
        email: '',
        password: '',
        stayOnline: '',
        token: ''
    });
    const [token2fa, setToken2fa] = useState({
        status: false,
        err: ''
    });
    const [redirectState, setRedirectState] = useState(false);
    const [loginState, setLoginState] = useState({
        status: false,
        err: '',
        code: '',
        });
        
    const inputRef = useRef(null);
    function handleChange(event) {
        if (event.target.name === 'token') event.target.value = event.target.value.replace(/\D/g, '');
        setFormState({...formState, [event.target.name]: event.target.value});
    }
    function handleSwitchChange(event) {
        setFormState({...formState, [event.target.name]: event.target.checked});
    }

    function handleSubmit(event) {
        event.preventDefault();
        console.log(formState)
        if (formState.email === '') {
            return setLoginState({status: true, err: 'Please, enter email'})
        } else if (formState.password === '') {
            return setLoginState({status: true, err: 'Please, enter password'})
        } else {
            setReqStatus(true)
            axios.post(`${serverURL}/login`, {
                ...formState
            })
                .then(res => {
                    if (!res.data.err) {
                        if (res.data.token) {
                            if (formState.stayOnline) {
                                localStorage.setItem('token', res.data.token);
                            } else {
                                sessionStorage.setItem('token', res.data.token);
                            }
                            
                            setRedirectState(true);
                        } setReqStatus(false)
                    } else { 
                        setReqStatus(false)
                        res.data.code === 'qrcode' ? handle2Fa(res.data.err) : handleError(res.data.err, res.data.code);
                    }
                }).catch(err => {
                console.log(err);
                setReqStatus(false)
                setLoginState({status: true, err: 'Server is not available'})
            })
   
        }
        
    }
    function handle2FaClick(event) {
        inputRef.current.focus();
        if (formState.token !== '') handleSubmit(event);
    }

    function handleError(text, code) {
        window.addEventListener('keydown', (event) => {if (event.keyCode === 27) handleClick()});
        setLoginState({
            status: true,
            err: text,
            code: code
        });

    }
  
    function handle2Fa(text) {
        window.addEventListener('keydown', (event) => {if (event.keyCode === 27) handle2FaClose()});
        setToken2fa({status: true, err: text});
    }
    function handle2FaClose() {
        window.removeEventListener('keydown', (event) => {if (event.keyCode === 27) handle2FaClose()});
        setToken2fa({status: false, err: ''}); setFormState({...formState, token: ''});
    }
    function handleClick () {
        window.removeEventListener('keydown', (event) => {if (event.keyCode === 27) handleClick()});
        setLoginState({status: false, err: ''});
    }

    return (
        <form className='login-form' onSubmit={handleSubmit}>
            <div className='logo login-header'>Login</div>
            <div className='login-form-input-name'>
                Email
            </div>
            <input
                className='login-form-input'
                type='email'
                name='email'
                value={formState.email}
                onChange={handleChange}
                required
            />
            <div className='login-form-input-name'>
                Password
            </div>
            <input
                className='login-form-input'
                type='password'
                name='password'
                value={formState.password}
                onChange={handleChange}
                required
            />
            <div className='login-form-checkbox-line'>
                <label>
                    <input
                        type='checkbox'
                        name='stayOnline'
                        checked={formState.stayOnline}
                        onChange={handleSwitchChange}
                    />
                    <span>
                        Remember
                        </span>
                </label>
                <div className='change-page' onClick={() => setPopUpState(true,1)}>
                    Forgot password?
                </div>
            </div>
            <button type='submit' className={`login-button ${isSendingReq && 'login-button-disabled'}`}
             disabled={isSendingReq}>{isSendingReq ? 'Processing...' : 'Login'}</button>
            <div className='change-page' onClick={() => setPopUpState(true,2)}>
                Registration
            </div>
            {redirectState && <Redirect to='/dashboard'/>}
            {loginState.status && <div className='login-modal'>
                <div className='login-modal-window'>
                    <div className='login-modal-window-close' onClick={handleClick}>
                        <Cross/>
                    </div>
                    <div className='login-modal-window-data'>
                        {loginState.code === 'activation' && <Activation/>}
                        {loginState.err}
                    </div>
                    <button className='login-button' onClick={handleClick} >
                        OK
                    </button>
                </div>
            </div>}
            {token2fa.status && <div className='login-modal'>
                <div className='login-modal-window'>
                    <div className='login-modal-window-close' onClick={handle2FaClose}>
                        <Cross/>
                    </div>
                    <div className='login-modal-window-data'>
                        <div className='login-form-input-name'>
                            2fa
                        </div>
                        <input
                            ref={inputRef}
                            className='login-form-input fa ym-disable-keys'
                            type='text'
                            inputMode='numeric'
                            name='token'
                            placeholder='xxxxxx'
                            maxLength='6'
                            required
                            autoFocus={true}
                            value={formState.token}
                            onChange={handleChange}
                        />
                        {token2fa.err !== 'qrcode' && <div className='login-modal-error'>{token2fa.err}</div>}
                    </div>
                    <button className={`login-button ${isSendingReq && 'login-button-disabled'}`}
                     onClick={handle2FaClick}>{isSendingReq ? 'Processing...' : 'Login'}</button>
                </div>
            </div>}
        </form>
    );
};

export default LoginForm;