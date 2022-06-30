import React, {useState, useEffect} from 'react';
import './AdminCreateAcc.css'
import {ReactComponent as Cross} from "../../img/cross.svg";


const AdminCreateAcc = (props) => { 
useEffect(() => {
    if(props.account) {
    setAccountState(props.account)
    }
}, [props.account])



    function setDefaultValues(statusId, countryId) {  
        return {
            id:null,
            statusId: statusId,
            countryId: countryId,
            login: '',
            password: '',
            email: '',
            email_password: '',
            birth: '',
            code2fa: '',
            agent: '',
            resolution: '',
            language: '',
            platform: '',
            concurrency: 2,
            proxy: '',
            proxy_id: '',
            proxy_ip: '',
            proxy_login: '',
            proxy_password: '',
            proxy_date: '',
            userId: '',
            selfie: '',
            token: '',
            archived: '',
            changeAccount: '',
            cookies:''
        }
    }
console.log(props.account)
    const [accountState, setAccountState] = useState(props.account ? {
        id:props.account.id,
        statusId: props.account.statusId || 1,
        countryId: props.account.countryId || 1,
        login: props.account.login || '',
        password: props.account.password || '',
        email: props.account.email || '',
        email_password: props.account.email_password || '',
        birth: props.account.birth || '',
        code2fa: props.account.code2fa || '',
        agent: props.account.agent || '',
        resolution: props.account.resolution || '',
        language: props.account.language || '',
        platform: props.account.platform || '',
        concurrency: props.account.concurrency || 2,
        proxy: props.account.proxy || '',
        proxy_id: props.account.proxy_id || '',
        proxy_ip: props.account.proxy_ip || '',
        proxy_login: props.account.proxy_login || '',
        proxy_password: props.account.proxy_password || '',
        proxy_date: props.account.proxy_date || '',
        userId: props.account.userId ? props.account.userId : '',
        /*selfie: props.account.selfie,*/
        token: props.account.token || '',
        archived: props.account.archived || '',
        bmId: props.account.bmId ? props.account.bmId : '',
        changeAccount: '',
        cookies:props.account.cookies || ''
        } : setDefaultValues(1,1)
    );

    const [showMore, setShowMore] = useState(false);
    const statusList = props.statuses?.map((el) =>
        <label key={el.id}>
            <input
                type='radio'
                id={el.id}
                name='statusId'
                onChange={handleRadioChange}
                checked={el.id.toString() === accountState?.statusId.toString()}
            />
            <div className='radio-text'>{el.name}</div>
        </label>
    );
    const countryList = props.countries?.map((el) =>
        <label key={el.id}>
            <input
                type='radio'
                id={el.id}
                name='countryId'
                onChange={handleRadioChange}
                checked={el.id.toString() === accountState?.countryId.toString()}
            />
            <div className='radio-text'>{el.name}</div>
        </label>
    );

    function handleClick (event) {
        event.preventDefault();
        async function postAcc () {
            const res = await props.accCreateOrUpdate(accountState);
            const adminData = await props.getUserData();
            props.setUserState(adminData.data);
            if (res.data === 'OK') {
                window.addEventListener('keydown', (event) => {if (event.keyCode === 27) handleModalClick()});
                setAccModalState(true);
                accountState.id || setAccountState(setDefaultValues(accountState.statusId, accountState.countryId))
                
            } else {
            
                alert('Something went wrong')
            }
        }
        postAcc().then();
    }

    const [accModalState, setAccModalState] = useState(false);


    function handleSwitchChange(event) {
        setAccountState({...accountState, [event.target.id]: event.target.checked});
    }

    async function handleModalClick () {
        window.removeEventListener('keydown', (event) => {if (event.keyCode === 27) handleModalClick()});
        setAccModalState(false);
    }

    function handleChange(event) {
        setAccountState({...accountState, [event.target.name]: event.target.value});
    }

    function handleRadioChange(event) {
        
        setAccountState({...accountState, [event.target.name]: event.target.id});
    }
    
    function handlePaste (event) {
        event.preventDefault();
        let pastedValue = event.clipboardData.getData("text");
        pastedValue.trim();
        pastedValue = pastedValue.split(' ');
        setAccountState({...accountState, proxy_ip: pastedValue[0], proxy_login: pastedValue[1], proxy_password: pastedValue[2]});
    }

    return (
        <form className='create-account' onSubmit={handleClick}>
            {/*{console.log(props)}*/}
            <div className='create-account-header-name'>
                Account settings
            </div>
            <div className='create-account-section'>
                <div className='create-account-section-name'>
                    Main {props.account && props.account.id}
                </div>
                <div className='create-account-section-tr tr-with-radio'>
                    <div className='create-account-section-td'>
                        <div className='create-account-section-td-name'>
                            Status
                        </div>
                        <div className='create-account-section-td-radio-status'>
                            {statusList}
                        </div>
                    </div>
                    <div className='create-account-section-td'>
                        <div className='create-account-section-td-name'>
                            Country
                        </div>
                        <div className='create-account-section-td-radio-country'>
                            {countryList}
                        </div>
                    </div>
                </div>
                <div className='create-account-section-tr'>
                    <div className='create-account-section-td'>
                        <div className='create-account-section-td-name'>
                            Login
                        </div>
                        <div className='create-account-section-td-data'>
                            <input
                                className='text-input'
                                type='text'
                                name='login'
                                placeholder='login'
                                value={accountState.login}
                                onChange={handleChange}
                                maxLength='40'
                            />
                        </div>
                    </div>
                    <div className='create-account-section-td'>
                        <div className='create-account-section-td-name'>
                            Password
                        </div>
                        <div className='create-account-section-td-data'>
                            <input
                                className='text-input'
                                type='text'
                                name='password'
                                placeholder='password'
                                value={accountState.password}
                                onChange={handleChange}
                                maxLength='32'
                            />
                        </div>
                    </div>
                    <div className='create-account-section-td'>
                        <div className='create-account-section-td-name'>
                            Birthday
                        </div>
                        <div className='create-account-section-td-data'>
                            <input
                                className='text-input'
                                type='text'
                                name='birth'
                                placeholder='birthday'
                                value={accountState.birth}
                                onChange={handleChange}
                                maxLength='15'
                            />
                        </div>
                    </div>
                </div>
                <div className='create-account-section-tr'>
                    <div className='create-account-section-td'>
                        <div className='create-account-section-td-name'>
                            Email
                        </div>
                        <div className='create-account-section-td-data'>
                            <input
                                className='text-input'
                                type='email'
                                name='email'
                                placeholder='email'
                                value={accountState.email}
                                onChange={handleChange}
                                maxLength='40'
                            />
                        </div>
                    </div>
                    <div className='create-account-section-td'>
                        <div className='create-account-section-td-name'>
                            Email pwd
                        </div>
                        <div className='create-account-section-td-data'>
                            <input
                                className='text-input'
                                type='text'
                                name='email_password'
                                placeholder='email password'
                                value={accountState.email_password}
                                onChange={handleChange}
                                maxLength='32'
                            />
                        </div>
                    </div>
                    <div className='create-account-section-td'>
                        <div className='create-account-section-td-name'>
                            2FA
                        </div>
                        <div className='create-account-section-td-data'>
                            <input
                                className='text-input'
                                type='text'
                                name='code2fa'
                                placeholder='2FA'
                                value={accountState.code2fa}
                                onChange={handleChange}
                                maxLength='100'
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className='create-account-section'>
                <div className='create-account-section-name'>
                    Proxy
                </div>
                <div className='create-account-section-tr'>
                    <div className='create-account-section-td'>
                        <div className='create-account-section-td-name'>
                            Type
                        </div>
                        <div className='create-account-section-td-data'>
                            <label>
                                <input
                                    type='radio'
                                    id='HTTP'
                                    name='proxy'
                                    onChange={handleRadioChange}
                                    checked={accountState.proxy === 'HTTP'}
                                />
                                <div className='radio-text'>HTTP</div>
                            </label>
                            <label>
                                <input
                                    type='radio'
                                    id='SOCKS5'
                                    name='proxy'
                                    onChange={handleRadioChange}
                                    checked={accountState.proxy === 'SOCKS5'}
                                />
                                <div className='radio-text'>SOCKS5</div>
                            </label>
                        </div>
                    </div>
                </div>
                <div className='create-account-section-tr'>
                    <div className='create-account-section-td'>
                        <div className='create-account-section-td-name'>
                            ID
                        </div>
                        <div className='create-account-section-td-data'>
                            <input
                                className='text-input'
                                type='text'
                                name='proxy_id'
                                placeholder='id'
                                value={accountState.proxy_id}
                                onChange={handleChange}
                                maxLength='12'
                            />
                        </div>
                    </div>
                    <div className='create-account-section-td'>
                        <div className='create-account-section-td-name'>
                            IP
                        </div>
                        <div className='create-account-section-td-data'>
                            <input
                                className='text-input'
                                type='text'
                                name='proxy_ip'
                                placeholder='IP:Port'
                                value={accountState.proxy_ip}
                                onChange={handleChange}
                                onPaste={handlePaste}
                                maxLength='20'
                            />
                        </div>
                    </div>
                    <div className='create-account-section-td'>
                        <div className='create-account-section-td-name'>
                            Login
                        </div>
                        <div className='create-account-section-td-data'>
                            <input
                                className='text-input'
                                type='text'
                                name='proxy_login'
                                placeholder='login'
                                value={accountState.proxy_login}
                                onChange={handleChange}
                                maxLength='40'
                            />
                        </div>
                    </div>
                    <div className='create-account-section-td'>
                        <div className='create-account-section-td-name'>
                            Password
                        </div>
                        <div className='create-account-section-td-data'>
                            <input
                                className='text-input'
                                type='text'
                                name='proxy_password'
                                placeholder='Пароль'
                                value={accountState.proxy_password}
                                onChange={handleChange}
                                maxLength='32'
                            />
                        </div>
                    </div>
                    <div className='create-account-section-td'>
                        <div className='create-account-section-td-name'>
                            Info
                        </div>
                        <div className='create-account-section-td-data'>
                            <input
                                className='text-input'
                                type='text'
                                name='proxy_date'
                                placeholder='info'
                                value={accountState.proxy_date}
                                onChange={handleChange}
                                maxLength='20'
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className='create-account-section'>
                <div className='create-account-section-name name-with-button'>
                    Other
                    <button type='submit'>Save</button>
                </div>
                <div className='create-account-section-tr'>
                    <div className='create-account-section-td'>
                        <div className='create-account-section-td-name'>
                            User
                        </div>
                        <div className='create-account-section-td-data'>
                            <input
                                className='text-input'
                                type='number'
                                name='userId'
                                placeholder='ID'
                                value={accountState.userId}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>
                    </div>
                    {props.account?.id && <div className='create-account-section-td'>
                        <div className='create-account-section-td-name'>
                            Change to
                        </div>
                        <div className='create-account-section-td-data'>
                            <input
                                className='text-input'
                                type='number'
                                name='changeAccount'
                                placeholder='account ID'
                                value={accountState.changeAccount}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>
                    </div>}
                    <div className='create-account-section-td'>
                        <div className='create-account-section-td-name'>
                            FB Token
                        </div>
                        <div className='create-account-section-td-data'>
                            <input
                                className='text-input'
                                type='text'
                                name='token'
                                placeholder='facebook token'
                                value={accountState.token}
                                onChange={handleChange}
                                maxLength='250'
                            />
                        </div>
                    </div>
                    <div className='create-account-section-td'>
                        <div className='create-account-section-td-name'>
                            COOKIES
                        </div>
                        <div className='create-account-section-td-data'>
                            <input
                                className='text-input'
                                type='text'
                                name='cookies'
                                placeholder='cookies'
                                value={accountState.cookies}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className='create-account-section-td'>
                        <div className='create-account-section-td-name'>
                            Archived
                        </div>
                        <div className='create-account-section-td-data'>
                            <label className='create-account-section-td-checkbox-input'>
                                <input
                                    type='checkbox'
                                    id='archived'
                                    onChange={handleSwitchChange}
                                    checked={accountState.archived}
                                />
                                <span className='create-account-section-td-checkbox-input-text'>
                                    Archived
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
                {showMore ? <><div className='create-account-section-tr'>
                    <div className='create-account-section-td'>
                        <div className='create-account-section-td-name'>
                            User Agent
                        </div>
                        <div className='create-account-section-td-data'>
                            <input
                                className='text-input'
                                type='text'
                                name='agent'
                                placeholder='User-Agent'
                                value={accountState.agent}
                                onChange={handleChange}
                                maxLength='200'
                            />
                        </div>
                    </div>
                    <div className='create-account-section-td'>
                        <div className='create-account-section-td-name'>
                            Language
                        </div>
                        <div className='create-account-section-td-data'>
                            <input
                                className='text-input'
                                type='text'
                                name='language'
                                placeholder='Accept-Language'
                                value={accountState.language}
                                onChange={handleChange}
                                maxLength='30'
                            />
                        </div>
                    </div>
                    <div className='create-account-section-td'>
                        <div className='create-account-section-td-name'>
                            Resolution
                        </div>
                        <div className='create-account-section-td-data'>
                            <input
                                className='text-input'
                                type='text'
                                name='resolution'
                                placeholder='Разрешение'
                                value={accountState.resolution}
                                onChange={handleChange}
                                maxLength='12'
                            />
                        </div>
                    </div>
                </div>
                <div className='create-account-section-tr'>
                    <div className='create-account-section-td'>
                        <div className='create-account-section-td-name'>
                            Platform
                        </div>
                        <div className='create-account-section-td-data'>
                            <input
                                className='text-input'
                                type='text'
                                name='platform'
                                placeholder='Платформа'
                                value={accountState.platform}
                                onChange={handleChange}
                                maxLength='10'
                            />
                        </div>
                    </div>
                    <div className='create-account-section-td'>
                        <div className='create-account-section-td-name'>
                            Concurrency
                        </div>
                        <div className='create-account-section-td-data'>
                            <select
                                className='text-input'
                                name='concurrency'
                                onChange={handleChange}
                                required
                                defaultValue={accountState.concurrency}
                            >
                                <option value='2'>2</option>
                                <option value='4'>4</option>
                                <option value='6'>6</option>
                                <option value='8'>8</option>
                                <option value='16'>16</option>
                            </select>
                        </div>
                    </div>
                </div></> : <div onClick={() => setShowMore(true)} className='create-account-show-more'>Show more</div>}
            </div>
            {/*<Form.Group as={Row}>
                <Form.Label column sm={3}>
                    Загрузить селфи:
                </Form.Label>
                <Form.File
                    name='selfie'
                    value={accountState.selfie}
                    onChange={handleChange}
                    disabled
                />
            </Form.Group>
            </div>
            <Form.Group as={Row}>
                <Form.Label column sm={3}>
                    Прикрепить BM:
                </Form.Label>
                <Col sm={2}>
                    <Form.Control
                        type='number'
                        name='bmId'
                        placeholder='BM ID'
                        value={accountState.bmId}
                        onChange={handleChange}
                        required
                        min="0"
                    />
                </Col>
            </Form.Group>*/}
            {accModalState && <div className='modal'>
                <div className='modal-window'>
                    <div className='modal-window-close' onClick={handleModalClick}>
                        <Cross/>
                    </div>
                    <div className='modal-window-data'>
                        {accountState.id ? 'Your changes have been made' : 'New account has been added'}
                    </div>
                    <button onClick={handleModalClick}>
                        OK
                    </button>
                </div>
            </div>}
        </form>
    );
};

export default AdminCreateAcc;