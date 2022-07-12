import React, {useState, useEffect} from 'react';
import './Settings.css';
import {NavLink} from 'react-router-dom';
import {ReactComponent as Cross} from "../../img/cross.svg";
import {ReactComponent as Logout} from '../../img/logout.svg';
import {ReactComponent as Skype} from '../../img/skype.svg';
import {ReactComponent as Telegram} from '../../img/telegram.svg';
import {ReactComponent as Mla} from '../../img/mla.svg';
import TopUp from './top-up/TopUpContainer';
import Referral from './referral/Referral'
import {connect} from "react-redux";
import {getRequisites} from "../../Redux/Reducers/priceList";

const Settings = (props) => {

    useEffect(() => {
        props.getRequisites();
    }, [])

    const [settingsState, setSettingsState] = useState({
        password: '',
        newPassword: '',
        confirmPassword: '',
        telegram: props.user.telegram || '',
        skype: props.user.skype || '',
        mla: props.user.mla || '',
        ru: props.ru,
        telMessages: props.telMessages,
        auth: props.auth
    });
    const [informationState, setInformationState] = useState('');
    const [informationModalState, setInformationModalState] = useState(false);
    const [settingsModalState, setSettingsModalState] = useState(false);
    const [changePasswordState, setChangePasswordState] = useState(false);


    async function patchProfile() {
        const res = await props.patchUserData(settingsState);
        const data = await props.getUserData();
        props.setUserState(data.data);
        if (res.data === 'OK') {
            window.addEventListener('keydown', (event) => {if (event.keyCode === 27) handleModalClick()});
            setSettingsModalState(true);
            setChangePasswordState(false);
            setSettingsState({...settingsState, password: '', newPassword: '', confirmPassword: ''})
        } else {
            setInformationState(res.data);
            setInformationModalState(true);
        }
    }

    function handleClick(event) {
        event.preventDefault();
        if ((settingsState.newPassword === settingsState.confirmPassword && settingsState.newPassword !== '' && settingsState.password !== '')
            || (settingsState.newPassword === '' && settingsState.newPassword === '' && settingsState.password === '')) {
            patchProfile().then();
        } else {
            setInformationState('ResetPassword confirmation doesnt match password');
            window.addEventListener('keydown', (event) => {if (event.keyCode === 27) handleInformationModalClick()});
            setInformationModalState(true);
        }
    }
    function handleExit() {
        localStorage.clear();
        sessionStorage.clear();
    }
    function handleSwitchChange(event) {
        setSettingsState({...settingsState, [event.target.id]: event.target.checked});
    }
    function handleChange(event) {
        setSettingsState({...settingsState, [event.target.name]: event.target.value});
    }

    function handleModalClick() {
        window.removeEventListener('keydown', (event) => {if (event.keyCode === 27) handleModalClick()});
        setSettingsModalState(false);
    }
    function handleInformationModalClick() {
        window.removeEventListener('keydown', (event) => {if (event.keyCode === 27) handleInformationModalClick()});
        setInformationModalState(false);
    }

    return (
        <div className='settings'>
            <div className='settings-header-name'>
                Settings
                <NavLink onClick={handleExit} to='/'>
                    <Logout/>
                    Logout
                </NavLink>
            </div>
            
            <TopUp balance = {props.balance} user = {props.user} />

            <div className='settings-section'>
                <div className='settings-section-name'>
                    Social
                </div>
                <div className='settings-section-tr long'>
                    <div className='settings-section-td'>
                        <div className='settings-section-td-name'>
                            Telegram
                        </div>
                        <div className='settings-section-td-data'>
                            <label>
                            <span>
                                <Telegram/>
                            </span>
                                <input
                                    className='text-input'
                                    type='text'
                                    name='telegram'
                                    value={settingsState.telegram}
                                    onChange={handleChange}
                                    placeholder='Enter your Telegram'
                                />
                            </label>
                        </div>
                    </div>
                </div>
                <div className='settings-section-tr long'>
                    <div className='settings-section-td'>
                        <div className='settings-section-td-name'>
                            Skype
                        </div>
                        <div className='settings-section-td-data'>
                            <label>
                                <span>
                                    <Skype/>
                                </span>
                                <input
                                    className='text-input'
                                    type='text'
                                    name='skype'
                                    value={settingsState.skype}
                                    onChange={handleChange}
                                    placeholder='Enter your Skype'
                                />
                            </label>
                        </div>
                    </div>
                </div>
                <div className='settings-section-tr long'>
                    <div className='settings-section-td'>
                        <div className='settings-section-td-name'>
                            MLA
                        </div>
                        <div className='settings-section-td-data'>
                            <label>
                            <span>
                                <Mla/>
                            </span>
                                <input
                                    className='text-input'
                                    type='text'
                                    name='mla'
                                    value={settingsState.mla}
                                    onChange={handleChange}
                                    placeholder='Enter your Multilogin E-Address'
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <Referral /> 
            {props.user.admin && <div className='settings-section'>
                <div className='settings-section-name'>
                    Other
                </div>
                <div className='settings-section-tr'>
                    <div className='settings-section-td'>
                        <div className='settings-section-td-data'>
                            <label className='settings-section-td-checkbox-input'>
                                <input
                                    type='checkbox'
                                    id='telMessages'
                                    onChange={handleSwitchChange}
                                    checked={settingsState.telMessages}
                                />
                                <span className='settings-section-td-checkbox-input-text'>
                                    Telegram notifications
                            </span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className='settings-section-tr no-margin'>
                    <div className='settings-section-td'>
                        <div className='settings-section-td-data'>
                            <label className='settings-section-td-checkbox-input'>
                                <input
                                    type='checkbox'
                                    id='auth'
                                    onChange={handleSwitchChange}
                                    checked={settingsState.auth}
                                />
                                <span className='settings-section-td-checkbox-input-text'>
                                    2FA
                            </span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>}
            <div className='settings-section'>
                <div className='settings-section-name'>
                    Password
                    <button onClick={handleClick}>Save</button>
                </div>
                <div className='settings-section-tr'>
                    <div className='settings-section-td'>
                        <div className='settings-section-td-data'>
                            {!changePasswordState ? <div onClick={() => setChangePasswordState(true)} className='setting-change-password'>Change password</div> :
                            <input
                                className='text-input'
                                type='password'
                                name='password'
                                placeholder='old password'
                                value={settingsState.password}
                                onChange={handleChange}
                            />}
                        </div>
                    </div>
                    {changePasswordState && <><div className='settings-section-td'>
                        <div className='settings-section-td-data'>
                            <input
                                className='text-input'
                                type='password'
                                name='newPassword'
                                placeholder='new password'
                                value={settingsState.newPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className='settings-section-td'>
                        <div className='settings-section-td-data'>
                            <input
                                className='text-input'
                                type='password'
                                name='confirmPassword'
                                placeholder='repeat new password'
                                value={settingsState.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div></>}
                </div>
            </div>
            {informationModalState && <div className='modal'>
                <div className='modal-window'>
                    <div className='modal-window-close' onClick={handleInformationModalClick}>
                        <Cross/>
                    </div>
                    <div className='modal-window-data'>
                        {informationState}
                    </div>
                    <button onClick={handleInformationModalClick}>
                        OK
                    </button>
                </div>
            </div>}
            {settingsModalState && <div className='modal'>
                <div className='modal-window'>
                    <div className='modal-window-data'>
                        Your changes have been made
                    </div>
                    <button onClick={handleModalClick}>
                        OK
                    </button>
                </div>
            </div>}
        </div>
    );
};
const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps, {getRequisites})(Settings)
