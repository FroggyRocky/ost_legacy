import React, {useState} from 'react';
import axios from 'axios';
import {serverURL} from '../api/URL'
import {ReactComponent as Mla} from '../img/mla.svg'
import {ReactComponent as Skype} from '../img/skype.svg'
import {ReactComponent as Telegram} from '../img/telegram.svg'
import {ReactComponent as Globe} from '../img/globe.svg'
import {ReactComponent as Cross} from "../img/cross.svg";
import {ReactComponent as Left} from "../img/left.svg";
import sendMetrix from '../common/sendMentrix.js'

const Registration = ({setPopUpState}) => {
    const countries = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Rep', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea North', 'Korea South', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russian Federation', 'Rwanda', 'St Lucia', 'Samoa', 'San Marino', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',];
    const [isSendingReq, setReqStatus] = useState(false)
    const [isSubmitting, setSubmitState] = useState(false)
    const [registrationState, setRegistrationState] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        telegram: '',
        skype: '',
        mla: '',
        country: countries[0]
    });
    const [modalState, setModalState] = useState({
        status: false,
        err: '',
        login: false
    });
    const [pageState, setPageState] = useState(false);
    const listOfCountries = countries.map((country,i) => <option key={i} value={country}>{country}</option>);

    function handleNext(event) {
        event.preventDefault();
        setSubmitState(true)
        if (registrationState.email === '') {
            window.addEventListener('keydown', (event) => {if (event.keyCode === 27) handleOkClick()});
            setSubmitState(false)
            return setModalState({status: true, err: 'Please, enter email', login: false})
        } else if (registrationState.password === '') {
            window.addEventListener('keydown', (event) => {if (event.keyCode === 27) handleOkClick()});
            setSubmitState(false)
            return setModalState({status: true, err: 'Please, enter password', login: false})
        } else if (registrationState.password !== registrationState.confirmPassword) {
            window.addEventListener('keydown', (event) => {if (event.keyCode === 27) handleOkClick()});
            setSubmitState(false)
            return setModalState({status: true, err: 'ResetPassword confirmation doesnt match password', login: false})
        } else {
            setPageState(true);
            setSubmitState(false)
        }
        
    }
    function handleChange(event) {
        setRegistrationState({...registrationState, [event.target.name]: event.target.value})
    }
    function handleSubmit(event) {
        event.preventDefault();
        sendMetrix('Create Account', 'Account Created');
        setReqStatus(true)
        const successful = <div><h3>Registration Successful!</h3>
            An email has been sent to your address confirming your participation
            <br/><br/>
            Please check your email address till we verify your account.
            <br/><br/>
            If you do not receive the email please check your spam filter or contact us.
            <br/><br/>
        </div>;
        if (registrationState.password === registrationState.confirmPassword) {
            setReqStatus(true)
            axios.post(`${serverURL}/registration`, {
                ...registrationState
            })
                .then(res => {
                    setReqStatus(false)
                    res.data.err ? logIn(res.data.err) : setModalState({status: true, err: successful, login: true});
                })
                .catch((err) =>  {console.log(err); setReqStatus(false)})
        } else {
            setReqStatus(false)
            alert('ResetPassword confirmation doesnt match password')
        }
    }
    function logIn(text) {
        window.addEventListener('keydown', (event) => {if (event.keyCode === 27) handleOkClick()});
        setModalState({status: true, err: text, login: false})
    }
    function handleOkClick () {
        window.removeEventListener('keydown', (event) => {if (event.keyCode === 27) handleOkClick()});
        setModalState({status: false, err: '', login: false});
    }
    return (
        <div className='registration'>
            <div className='logo'>Registration</div>
            {!pageState && <form onSubmit={handleNext}>
                <div className='registration-step'>Step 1/2</div>
                <div className='login-form-input-name'>
                    Email
                </div>
                <input
                    className='login-form-input'
                    type='email'
                    name='email'
                    value={registrationState.email}
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
                    value={registrationState.password}
                    onChange={handleChange}
                    required
                />
                <div className='login-form-input-name'>
                    Confirm password
                </div>
                <input
                    className='login-form-input'
                    type='password'
                    name='confirmPassword'
                    value={registrationState.confirmPassword}
                    onChange={handleChange}
                    required
                />
                <button className={`login-button ${isSubmitting && 'login-button-disabled'}`} type='submit' >
                    {isSubmitting ? 'Processing' : 'Next step'}
                    </button>
            </form>}
            {pageState && <>
                <div className='registration-step'><span className='registration-step-back' onClick={() => setPageState(false)}><Left/></span> Step 2/2</div>
                <div className='registration-input'>
                    <span>
                        <Globe/>
                    </span>
                    <select
                        className='login-form-input'
                        name='country'
                        value={registrationState.country}
                        onChange={handleChange}
                        required
                    >
                        {listOfCountries}
                    </select>
                </div>
                <div className='registration-input'>
                    <span>
                        <Telegram/>
                    </span>
                    <input
                        className='login-form-input'
                        type='text'
                        name='telegram'
                        placeholder='Enter your Telegram'
                        value={registrationState.telegram}
                        onChange={handleChange}
                    />
                </div>
                <div className='registration-input'>
                    <span>
                        <Skype/>
                    </span>
                    <input
                        className='login-form-input'
                        type='text'
                        name='skype'
                        placeholder='Enter your Skype'
                        value={registrationState.skype}
                        onChange={handleChange}
                    />
                </div>
                <div className='registration-input'>
                    <span>
                        <Mla/>
                    </span>
                    <input
                        className='login-form-input'
                        type='text'
                        name='mla'
                        placeholder='Enter your Multilogin E-Addres'
                        value={registrationState.mla}
                        onChange={handleChange}
                    />
                </div>
                <button 
                className={`login-button ${isSendingReq && 'login-button-disabled'}`}
                 onClick={handleSubmit}
                 disabled={isSendingReq}>
                {isSendingReq ? 'Processing' : 'Create account'}
                 </button>
            </>}
            {modalState.status && <div className='login-modal'>
                <div className='login-modal-window'>
                    {!modalState.login && <div className='login-modal-window-close' onClick={handleOkClick}>
                        <Cross/>
                    </div>}
                    <div className='login-modal-window-data'>
                        {modalState.err}
                    </div>
                    {modalState.login ? <button className='login-button' onClick={() => setPopUpState(true,0)}>
                        Login
                    </button> : <button className='login-button' onClick={handleOkClick}>
                        OK
                    </button>}
                </div>
            </div>}
            <div className='change-page' onClick={() => setPopUpState(true,0)}>
                Back to login
            </div>
        </div>
    );
};

export default Registration;