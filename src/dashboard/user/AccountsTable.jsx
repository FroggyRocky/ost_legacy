import React, { useEffect, useState } from 'react';
import TableAdditionalInfo from "../../modules/TableAdditionalInfo";
import ReactTooltip from "react-tooltip";
import { NavLink } from "react-router-dom";
import './AccountsTable.scss'
import AccBmPagination from "./AccBmPagination";
import axios from "axios";
import { connect } from 'react-redux';
import AdminCreateFromExcel from "../admin/AdminCreateFromExcel";
import CreateTicket from "../tickets/CreateTicket";
import { setTicketModalState } from '../../Redux/Reducers/tickets'
import { ReactComponent as Plus } from '../../img/plus.svg';
import { ReactComponent as Down } from '../../img/down.svg';
import { ReactComponent as Cross } from '../../img/cross.svg';
import { ReactComponent as Tick } from '../../img/tick.svg';
import { ReactComponent as Error } from '../../img/exclamation.svg';
import { ReactComponent as Pencil } from '../../img/pencil.svg';
import { ReactComponent as Forever } from '../../img/forever.svg';
import { ReactComponent as Refresh } from '../../img/refresh.svg';
import { ReactComponent as Key } from '../../img/key.svg';
import { ReactComponent as Bag } from '../../img/bag.svg';
import { ReactComponent as Clipboard } from '../../img/clipboard.svg';
import { ReactComponent as Facebook } from '../../img/facebook.svg';
import { ReactComponent as Proxy } from '../../img/proxy.svg';
import { ReactComponent as Info } from '../../img/info.svg';
import { ReactComponent as Link } from '../../img/link.svg';
import { ReactComponent as Folder } from '../../img/folder.svg';
import DropDown from '../../common/DropDown';

const AccountsTable = (props) => {

    const [modalArchiveState, setModalArchiveState] = useState(false);
    const [modalProblemState, setModalProblemState] = useState(false);
    const [modalAddTrafficState, setModalAddTrafficState] = useState(false);
    const [modalAddTicketState, setModalAddTicketState] = useState({
        active: false,
        title: ''
    });
    const [addTrafficState, setAddTrafficState] = useState(null);
    const [bmIdState, setBmIdState] = useState(props.freeUserBms?.length !== 0 && !props.user.admin && !props.archive ? props.freeUserBms[0].id : null);
    const [dataState, setDataState] = useState(null);
    const [dropDownState, setDropDownState] = useState('500 MB - 4$') // drop down to choose traffic top up
    const dropDownOptions = ['100 MB - 4$', '500 MB - 4$', '1 GB - 8$', '2 GB - 15$', '5 GB - 40$']
    const [isAddTrafficSubmitting, setAddTrafficSubmitState] = useState(false)
    function handleTrafficTopUpChange(value) {
        setDropDownState(value)
    }

useEffect(() => {
    if(props.freeUserBms?.length !== 0 && !props.user.admin && !props.archive) {
        setBmIdState(props.freeUserBms[0].id)
    }
}, [props.freeUserBms])

    useEffect(() => {
        if (modalAddTrafficState) {
            document.body.style.overflowY = 'hidden'
        } else if (!modalAddTrafficState) {
            document.body.style.overflowY = 'auto'
        }
    }, [modalAddTrafficState])
    useEffect(async () => {
        props.setTicketModalState(modalAddTicketState.active)
    }, [modalAddTicketState.active])

    useEffect(() => {
        ReactTooltip.rebuild();
    });

    const listOfBms = props.freeUserBms?.map((el) => {
        return <option key={el.id} value={el.id}>{el.id}</option>
    });






    const accountsList = props.accounts?.map((el) => {
        const accountName = `${el.id} ${props.countries && TableAdditionalInfo.getValueById(props.countries, el.countryId)}`;
        let percentForBar;
        let daysTotal;
        let daysLeft;

        if (el.proxy_traffic_total && el.proxy_traffic_left >= 0) {
            percentForBar = Math.floor(el.proxy_traffic_left / el.proxy_traffic_total * 100);
        } else if (!el.proxy_traffic_left) {
            percentForBar = 0;
            daysLeft = 0;
            daysTotal = 0;

        }
        else {
            daysTotal = Math.ceil((new Date(el.proxy_date?.replace(/-/g, "/")) - new Date(el.createdAt)) / (1000 * 3600 * 24));
            if (daysTotal > 0) {
                daysLeft = Math.ceil((new Date() - new Date(el.createdAt)) / (1000 * 3600 * 24));
                percentForBar = 100 - Math.ceil(daysLeft / daysTotal * 100);
            } else {
                daysTotal = 0;
                daysLeft = 0;
                percentForBar = 0;
            }
        }
        if ((!props.archive && !el.archived) || (props.archive && el.archived)) {
            return <tbody key={el.id}>
                <tr>
                    <td>
                        <div className='accounts-table-id'>
                            <div className={`accounts-table-id-status ${TableAdditionalInfo.colorOfStatus(el.statusId)}`}></div>
                            <div className='accounts-table-id-click' onClick={TableAdditionalInfo.handleClick} data-id={el.id}>
                                <Down />
                            </div>
                            {accountName}
                        </div>
                    </td>
                    <td>
                        {el.bought ? <div className='accounts-table-date'>
                            <div className='accounts-table-date-time'>
                                {TableAdditionalInfo.convertTime(el.bought)}
                            </div>
                            <div className='accounts-table-date-date'>
                                {TableAdditionalInfo.convertDate(el.bought)}
                            </div>
                        </div>
                            : <div className='accounts-table-center'>
                                <Cross />
                            </div>
                        }
                    </td>
                    {props.user.admin && <td className='accounts-table-user'>{el.userId ? el.userId :
                        <div className='accounts-table-center'><Cross /></div>}</td>}
                    {props.user.admin && <td className='create-date'><div className='accounts-table-date'>
                        <div className='accounts-table-date-time'>
                            {TableAdditionalInfo.convertTime(el.createdAt)}
                        </div>
                        <div className='accounts-table-date-date'>
                            {TableAdditionalInfo.convertDate(el.createdAt)}
                        </div>
                    </div></td>}
                    <td>
                        <div className='accounts-table-login'>
                            {el.login}
                        </div>
                        <div className='accounts-table-password'>
                            {el.password}
                        </div>
                    </td>
                    <td>
                        <div className='accounts-table-limited'>
                            {/*{el.proxy_id ?*/}
                            <div className='accounts-table-limited-bar'>
                                <div className='accounts-table-limited-bar-label'>
                                    {el.proxy_traffic_total && el.proxy_traffic_left >= 0 ?
                                        <>
                                            <span className='label-mb'>{`${Math.floor(el.proxy_traffic_left / 1024 / 1024)} / ${Math.floor(el.proxy_traffic_total / 1024 / 1024)} mb`}</span>
                                            <span className='label-percent'>{percentForBar}%</span>
                                        </>
                                        :
                                        <>
                                            <span className='label-mb'>{`${daysLeft} / ${daysTotal} days`}</span>
                                            <span className='label-percent'>{percentForBar}%</span>
                                        </>}
                                </div>
                                <div className='bar' style={{ width: `${percentForBar}%` }}></div>
                            </div>
                            <div data-proxy_id={el.proxy_id} className='accounts-table-limited-traffic'>

                                {!props.archive && <div className='accounts-table-limited-icon'
                                    onClick={handleAddTrafficClick}  >
                                    <div className='accounts-table-bubble plus-bubble'>Add Traffic</div>
                                    <Plus className='account-plus-icon' />
                                </div>}

                                {el.proxy_traffic_total && el.proxy_traffic_left >= 0 ?
                                    <div className='accounts-table-limited-icon' onClick={getTraffic}
                                    >
                                        <div className='accounts-table-bubble refresh-bubble'>Refresh</div>
                                        <Refresh className='account-refresh-icon' />
                                    </div>
                                    :
                                    <div className='accounts-table-limited-icon' onClick={getTraffic}
                                    >
                                        <div className='accounts-table-bubble refresh-bubble'>Refresh</div>
                                        <Refresh className='account-refresh-icon' />
                                    </div>
                                }
                            </div>
                        </div>
                    </td>
                    <td className='accounts-table-bm-id'>
                        {el.bmId ? <div className='accounts-table-bm'>
                            <div className={`accounts-table-bm-label ${TableAdditionalInfo.colorOfStatus(el.bm.statusId)}`}></div>
                            <div className='accounts-table-bm-icon'>{el.bm.statusId === 3 ? <Error className='accounts-table-bm-icon-error' /> : <Tick className='icon-green' />}
                            </div>
                        </div>
                            : !props.archive && !props.user.admin && props.freeUserBms.length !== 0 ?
                                <>
                                    <select
                                        name='bmId'
                                        onChange={handleBmChange}
                                    >
                                        {listOfBms}
                                    </select>
                                    <div className='accounts-table-edit'>
                                        <div data-id={el.id} onClick={handleBindButtonClick}><Plus /></div>
                                    </div>
                                </> : <div className='accounts-table-center'>
                                    <Cross />
                                </div>
                        }
                    </td>
                    {/*{el.bmId ?
                <td className={TableAdditionalInfo.colorOfStatus(el.bm.statusId)}>{props.statuses && TableAdditionalInfo.getValueById(props.statuses, el.bm.statusId)}</td>
                : <td>
                    {!props.archive && !props.user.admin && props.freeUserBms.length !==0 && <div>
                    <button data-id={el.id} onClick={handleBindButtonClick}>Connect</button></div>}
                </td>}*/}
                    {props.user.admin && props.user.permission.acc_bm === 2 && props.user.permission.acc_bm_update && <td className='multi'>
                        {el.proxy_ip && el.proxy_login && el.proxy_password ?
                            <div className='accounts-table-multi'>
                                <div className='accounts-table-multi-icon' data-name={accountName} onClick={handleMultiClick}>
                                    <Plus className={el.uuid && 'accounts-table-multi-success'} />
                                </div>
                            </div>
                            : <div className='accounts-table-center'><Error /></div>}
                    </td>}
                    <td>
                        {props.user.admin ?
                            props.user.permission.acc_bm_update &&
                            <div className='accounts-table-edit'><NavLink to={`/dashboard/adminacclist/edit/${el.id}`}>
                                <div><Pencil /></div>
                            </NavLink></div>
                            : <div className='accounts-table-edit'>
                                <div data-id={el.id} onClick={handleArchiveClick}>
                                    <Folder />
                                </div>
                            </div>
                        }
                    </td>
                </tr>
                <tr id={el.id} hidden>
                    <td colSpan={props.user.admin ? (props.user.permission.acc_bm === 2 && props.user.permission.acc_bm_update ? 10 : 9) : 7} className='accounts-table-info-td'>
                        <div className='accounts-table-info-tr'>
                            <div className='accounts-table-info-tr-icon'>{el.statusId === 3 ?
                                <>
                                    <Key className='red' />Problem
                                </>
                                :
                                <>
                                    <Key />{!props.user.admin && !props.archive &&
                                        <div data-id={el.id} data-name='a' onClick={handleProblemClick}>
                                            <Error />
                                        </div>}
                                </>}
                            </div>
                            <div className='accounts-table-info-tr-info'>
                                <div className='accounts-table-info-tr-info-tr'>
                                    <div className='accounts-table-info-tr-info-icon'>
                                        <Facebook />
                                    </div>
                                    <div className='accounts-table-info-tr-info-item'>
                                        <div>Email</div>
                                        {el.email ? el.email : <Cross />}
                                    </div>
                                    <div className='accounts-table-info-tr-info-item'>
                                        <div>Email password</div>
                                        {el.email_password ? el.email_password : <Cross />}
                                    </div>
                                    {/*<div className='accounts-table-info-tr-info-copy'>
                                <div>Cookie</div>
                                {el.cookie ? <span className='copy' data-tip='Copied' id={el.cookie}><Clipboard/></span> : <span><Cross/></span>}
                            </div>*/}
                                    {/*<div>
                            <b>Resolution: </b>
                            {el.resolution ?
                                el.resolution
                                : <FontAwesomeIcon icon={faTimes}/>}
                        </div>
                        <div>
                            <b>Agent: </b>
                            {el.agent ?
                                <FontAwesomeIcon data-tip='Copied' icon={faClipboardCheck} id={el.agent}
                                                 size='lg'/>
                                : <FontAwesomeIcon icon={faTimes}/>}
                        </div>
                        <div>
                            <b>Language: </b>
                            {el.language ?
                                <FontAwesomeIcon data-tip='Copied' icon={faClipboardCheck} id={el.language}
                                                 size='lg'/>
                                : <FontAwesomeIcon icon={faTimes}/>}
                        </div>
                    </div>
                    <div>
                        <div>
                            <b>Platform: </b>
                            {el.platform ?
                                el.platform
                                : <FontAwesomeIcon icon={faTimes}/>}
                        </div>
                        <div>
                            <b>Concurency: </b>
                            {el.concurrency ?
                                el.concurrency
                                : <FontAwesomeIcon icon={faTimes}/>}
                        </div>*/}
                                    {/*<div className='accounts-table-info-tr-info-copy'>
                                <div>Token</div>
                                {el.token ? <span className='copy' data-tip='Copied' id={el.token}><Clipboard/></span> : <span><Cross/></span>}
                            </div>*/}
                                    <div className='accounts-table-info-tr-info-item'>
                                        <div>Date of Birth</div>
                                        {el.birth ? el.birth : <Cross />}
                                    </div>
                                    <div className='accounts-table-info-tr-info-copy'>
                                        <span className='fa-text'>2FA</span>
                                        <span>{el.code2fa || <Cross />}</span>
                                    </div>
                                </div>
                                <div className='accounts-table-info-tr-info-tr'>
                                    <div className='accounts-table-info-tr-info-icon'>
                                        <Proxy />
                                    </div>
                                    <div className='accounts-table-info-tr-info-item'>
                                        <div>Proxy</div>
                                        {el.proxy ? <span className='proxy'>{el.proxy}</span> : <Cross />}
                                    </div>
                                    <div className='accounts-table-info-tr-info-item'>
                                        <div>IP</div>
                                        {el.proxy_ip ? <span className='proxy_ip'>{el.proxy_ip}</span> : <Cross />}
                                    </div>
                                    <div className='accounts-table-info-tr-info-item'>
                                        <div>Login</div>
                                        {el.proxy_login ? <span className='proxy_login'>{el.proxy_login}</span> : <Cross />}
                                    </div>
                                    <div className='accounts-table-info-tr-info-item'>
                                        <div>Password</div>
                                        {el.proxy_password ? <span className='proxy_password'>{el.proxy_password}</span> : <Cross />}
                                    </div>
                                    {/*<div className='accounts-table-info-tr-info-item'>
                                <div>Info</div>
                                {el.proxy_date ? el.proxy_date : <Cross/>}
                            </div>*/}
                                </div>
                            </div>
                        </div>
                        {el.bmId &&
                            <div className='accounts-table-info-tr'>
                                <div className='accounts-table-info-tr-icon'>
                                    {el.bm.statusId === 3 ?
                                        <>
                                            <Bag className='red' />
                                            Problem
                                        </>
                                        :
                                        <>
                                            <Bag />
                                            {!props.user.admin && !props.archive && <div data-id={el.bm.id} data-name='b' onClick={handleProblemClick}>
                                                <Error />
                                            </div>}
                                        </>
                                    }
                                </div>
                                <div className='accounts-table-info-tr-info'>
                                    <div className='accounts-table-info-tr-info-tr'>
                                        <div className='accounts-table-info-tr-info-icon'>
                                            <Info />
                                        </div>
                                        <div className='accounts-table-info-tr-info-item'>
                                            <div>Type</div>
                                            {el.bm.bmTypeId ? TableAdditionalInfo.getValueById(props.bmTypes, el.bm.bmTypeId) : <Cross />}
                                        </div>
                                        <div className='accounts-table-info-tr-info-item'>
                                            <div>ID</div>
                                            {el.bm.faceBm ? el.bm.faceBm : <Cross />}
                                        </div>
                                        <div className='accounts-table-info-tr-info-item'>
                                            <div>Date</div>
                                            {el.bm.bought ? TableAdditionalInfo.convertDate(el.bm.bought) : <Cross />}
                                        </div>
                                    </div>
                                    <div className='accounts-table-info-tr-info-tr'>
                                        <div className='accounts-table-info-tr-info-icon'>
                                            <Link />
                                        </div>
                                        <div className='accounts-table-info-tr-info-copy'>
                                            <div>Link1</div>
                                            {el.bm.link1 ? <span className='copy' data-tip='Copied' id={el.bm.link1}><Clipboard /></span> : <span><Cross /></span>}
                                        </div>
                                        <div className='accounts-table-info-tr-info-copy'>
                                            <div>Link2</div>
                                            {el.bm.link2 ? <span className='copy' data-tip='Copied' id={el.bm.link2}><Clipboard /></span> : <span><Cross /></span>}
                                        </div>
                                        <div className='accounts-table-info-tr-info-copy'>
                                            <div>Link3</div>
                                            {el.bm.link3 ? <span className='copy' data-tip='Copied' id={el.bm.link3}><Clipboard /></span> : <span><Cross /></span>}
                                        </div>
                                    </div>
                                </div>
                            </div>}
                    </td>
                </tr>
                <tr className='accounts-table-spacer'></tr>
            </tbody>
        } else {
            return false;
        }
    });

    function handleBmChange(event) {
        setBmIdState(event.target.value);
    }

    function handleBindButtonClick(event) {
        async function bindBm() {
            let id;
            if (event.target.tagName === 'svg') {
                id = event.target.parentElement;
            } else if (event.target.tagName === 'path') {
                id = event.target.parentElement.parentElement;
            } else {
                id = event.target;
            }
            const res = await props.bindBmToAcc({ accId: id.dataset.id, bmId: bmIdState });
            const adminData = await props.getUserData();
            props.setUserState(adminData.data);
            if (res.data !== 'OK') {
                console.log(res.data);
                alert('There is an error...')
            }
        }
        bindBm().then();
    }

    function handleProblemClick(event) {
        let id;
        if (event.target.tagName === 'svg') {
            id = event.target.parentElement;
        } else if (event.target.tagName === 'path') {
            id = event.target.parentElement.parentElement;
        } else {
            id = event.target;
        }

        setDataState({ id: id.dataset.id, type: id.dataset.name });
        window.addEventListener('keydown', (event) => { if (event.keyCode === 27) handleProblemModalNoClick() });
        setModalProblemState(true);
    }
    async function getTraffic(event) {
        event.preventDefault();
        let proxyId;
        if (event.target.tagName === 'svg') {
            proxyId = event.target.parentElement.parentElement;
        } else if (event.target.tagName === 'path') {
            proxyId = event.target.parentElement.parentElement.parentElement;
        } else {
            proxyId = event.target.parentElement;
        }
        const res = await props.proxyTraffic({
            id: proxyId.parentElement.parentElement.parentElement.nextElementSibling.id,
            proxy_id: proxyId.dataset.proxy_id
        });
        if (res.data === 'OK') {
            const adminData = await props.getUserData();
            props.setUserState(adminData.data);
        } else {
            console.log(res.data);
            alert('There is an error...')
        }
    }

    const instance = axios.create(
        {
            baseURL: "http://localhost:35000/api/v2",
            withCredentials: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Origin': 'http://localhost:35000',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            }
        })
    async function handleMultiClick(event) {
        event.persist();
        let parentTrWithProxy;
        let parentDiv;
        if (event.target.tagName === 'svg') {
            parentDiv = event.target.parentElement;
            parentTrWithProxy = parentDiv.parentElement.parentElement.parentElement.nextElementSibling;
        } else if (event.target.tagName === 'path') {
            parentDiv = event.target.parentElement.parentElement;
            parentTrWithProxy = parentDiv.parentElement.parentElement.parentElement.nextElementSibling;
        } else {
            parentDiv = event.target;
            parentTrWithProxy = parentDiv.parentElement.parentElement.parentElement.nextElementSibling;
        }
        //   parentDiv.dataset.name
        const proxy_ip = (parentTrWithProxy.getElementsByClassName('proxy_ip')[0].innerText).split(':');
        let data = {
            'name': parentDiv.dataset.name,
            'os': "mac",
            'browser': 'mimic',
            'navigator': { 'language': 'en-US,en;q=0.5,en-US,en;q=0.9' },
            'network': {
                'proxy': {
                    'type': 'HTTP',
                    'host': proxy_ip[0],
                    'port': proxy_ip[1],
                    'username': parentTrWithProxy.getElementsByClassName('proxy_login')[0].innerText,
                    'password': parentTrWithProxy.getElementsByClassName('proxy_password')[0].innerText
                }
            },
            'extensions': {
                'enable': true,
                'names': ['editthiscookie.crx']
            },
        };

        try {
            event.target.hidden = true;
            const res = await instance.post(`/profile`, { ...data });
  
            if (res.status === 200) {
                await props.accountUUID({ uuid: res.data.uuid, id: parentTrWithProxy.id });
                parentDiv.innerText = 'OK'
            } else {
                alert('There is an error...');
                console.log(res.body);
            }
            event.target.hidden = false;
        } catch (e) {
            event.target.hidden = false;
            alert('There is an error with Multilogin, error in console!');
            console.log(e)
        }
    }

    function handleProblemModalNoClick() {
        window.removeEventListener('keydown', (event) => { if (event.keyCode === 27) handleProblemModalNoClick() });
        setModalProblemState(false);
    }

    function handleProblemModalYesClick() {
        async function sendProblem() {
            const adminData = await props.getUserData();
            props.setUserState(adminData.data);
            const accountCountryId = adminData.data.accounts[0].countryId
            const countryName = adminData.data.countries.filter(country => {
                return country.id === accountCountryId
            }).map(el => el.name)
            await props.getTickets();
            setModalProblemState(false);
            setModalAddTicketState({ active: true, title: `${dataState.type === 'a' ? 'Account' : 'BM'}: ${dataState.id} ${countryName}` })
        }
        sendProblem().then();
    }

    function handleArchiveClick(event) {
        let id;
        if (event.target.tagName === 'svg') {
            id = event.target.parentElement;
        } else if (event.target.tagName === 'path') {
            id = event.target.parentElement.parentElement;
        } else {
            id = event.target;
        }
        setDataState(id.dataset.id);
        window.addEventListener('keydown', (event) => { if (event.keyCode === 27) handleModalNoClick() });
        setModalArchiveState(true);
    }

    function handleModalNoClick() {
        window.removeEventListener('keydown', (event) => { if (event.keyCode === 27) handleModalNoClick() });
        setModalArchiveState(false);
    }

    function handleModalYesClick() {
        async function archiveAcc() {
            const res = await props.archiveUserAccount({ id: dataState, archived: !props.archive });
            const adminData = await props.getUserData();
            props.setUserState(adminData.data);
            if (res.data === 'OK') {
                setModalArchiveState(false);
            } else {
                setModalArchiveState(false);
                console.log(res.data);
                alert('There is an error...')
            }
        }
        archiveAcc().then();
    }

    function handleAddTrafficClick(event) {
        event.preventDefault();
        let proxyId;
        if (event.target.tagName === 'svg') {
            proxyId = event.target.parentElement.parentElement;
        } else if (event.target.tagName === 'path') {
            proxyId = event.target.parentElement.parentElement.parentElement;
        } else {
            proxyId = event.target.parentElement;
        }
        setAddTrafficState({
            id: proxyId.parentElement.parentElement.parentElement.nextElementSibling.id,
            proxy_id: proxyId.dataset.proxy_id
        });
        setModalAddTrafficState(true);

        window.addEventListener('keydown', (event) => { if (event.keyCode === 27) handleModalAddTrafficNoClick() });
    }

    function handleModalAddTrafficNoClick() {
        setModalAddTrafficState(false);
        window.removeEventListener('keydown', (event) => { if (event.keyCode === 27) handleModalAddTrafficNoClick() });
    }
    async function handleModalAddTrafficYesClick() {
        if (addTrafficState.id && addTrafficState.proxy_id) {
            setAddTrafficSubmitState(true)
            const data = {
                id: addTrafficState.id,
                proxy_id: addTrafficState.proxy_id,
                trafficAmount: dropDownState
            }
            const res = await props.addProxyTraffic(data);
            if (res.data === 'OK') {
                const adminData = await props.getUserData();
                props.setUserState(adminData.data);
                setAddTrafficSubmitState(false)
            } else {
                console.log(res.data);
                alert('There is an error...')
                setAddTrafficSubmitState(false)
            }
        }
        handleModalAddTrafficNoClick();
    }
    function handleModalAddTicketNoClick() {
        setModalAddTicketState({
            active: false,
            title: ''
        })
    }

    return (
        <div className='accounts'>
            {!props.archivePage && <div className='accounts-header'>
                <div className='accounts-header-name'>
                    Accounts
                </div>
                {props.user.admin && props.user.permission.acc_bm === 2 && props.user.permission.acc_bm_update &&
                    <NavLink to={`/dashboard/adminacclist/create/`}>
                        <div>
                            <Plus />
                            Create account
                        </div>
                    </NavLink>}
            </div>}
            <div className='accounts-admin-bar'>
                <AccBmPagination
                    accCount={props.accCount}
                    accArchivedCount={props.accArchivedCount}
                    getUserData={props.getUserData}
                    setUserState={props.setUserState}
                    paginationType={props.archive ? 'aa' : 'a'}
                    page={props.user.page}
                    admin={props.user.admin}
                    archive={props.archive}
                />
                {props.user.admin && props.user.permission.acc_bm_update && !props.archive && <AdminCreateFromExcel
                    countries={props.countries}
                    accCount={props.accCount}
                    getUserData={props.getUserData}
                    setUserState={props.setUserState}
                    accBulkCreate={props.accBulkCreate}
                    user={props.user}
                    proxyData={props.proxyData}
                />}
            </div>
            <table className='accounts-table'>
                <thead>
                    <tr>
                        <th className='accounts-id-column'>ID</th>
                        <th>Purchase</th>
                        {props.user.admin && <th>User</th>}
                        {props.user.admin && <th className='create-date'>Created</th>}
                        <th>Login, password</th>
                        <th>Traffic</th>
                        <th>
                            BM
                            <ReactTooltip effect="solid" event='click' delayHide={400}
                                afterShow={(evt) => TableAdditionalInfo.copyText(evt)} />
                        </th>
                        {props.user.admin && props.user.permission.acc_bm === 2 && props.user.permission.acc_bm_update && <th className='multi'>Multi</th>}
                        <th>{props.user.admin ? '' : 'Archive'}</th>
                    </tr>
                </thead>
                {accountsList}
            </table>
            {!props.user.admin && modalProblemState && <div className='modal'>
                <div className='modal-window'>
                    <div className='modal-window-close' onClick={handleProblemModalNoClick}>
                        <Cross />
                    </div>
                    <div className='modal-window-data'>
                        Do you really have problems with that account or BM?
                    </div>
                    <div className='modal-window-yes-no'>
                        <button onClick={handleProblemModalNoClick}>NO</button>
                        <button onClick={handleProblemModalYesClick}>YES</button>
                    </div>
                </div>
            </div>}
            {!props.user.admin && modalArchiveState && <div className='modal'>
                <div className='modal-window'>
                    <div className='modal-window-close' onClick={handleModalNoClick}>
                        <Cross />
                    </div>
                    <div className='modal-window-data'>
                        {props.archive ? 'Do you want to activate this account?' :
                            'Do you want to archive the account?'}
                    </div>
                    <div className='modal-window-yes-no'>
                        <button onClick={handleModalNoClick}>NO</button>
                        <button onClick={handleModalYesClick}>YES</button>
                    </div>
                </div>
            </div>}
            {modalAddTrafficState && !props.archive && <div className='modal'>
                <div className='modal-window'>
                    <div className='modal-window-close' onClick={handleModalAddTrafficNoClick}>
                        <Cross />
                    </div>
                    <div className='modal-window-data'>
                        {props.user.balance >= 4 ? <>
                            <div className='addTraffic__modal_text'>Do you want to renew port?</div>
                            <div className='addTraffic__dropDown'>
                                <DropDown placeholder={dropDownState} defaultPlaceholder='' dropDownOptions={dropDownOptions} selectOption={handleTrafficTopUpChange} />
                            </div>
                        </>
                            :
                            'You dont have 4$ on your account'
                        }
                    </div>
                    {props.user.balance >= 4 ?
                        <div className='modal-window-yes-no'>
                            <button onClick={handleModalAddTrafficNoClick}>NO</button>
                            <button disabled={isAddTrafficSubmitting} onClick={handleModalAddTrafficYesClick}>
                                {isAddTrafficSubmitting ? 'Loading...' : 'YES'}
                            </button>
                        </div>
                        :
                        <button onClick={handleModalAddTrafficNoClick}>
                            OK
                        </button>}
                </div>
            </div>}
            {modalAddTicketState.active && <div className='modal'>
                <div className='modal-window modal-window--create-ticket'>
                    <div className='modal-window-close' onClick={handleModalAddTicketNoClick}>
                        <Cross />
                    </div>
                    <div className='modal-window-data'>
                        <CreateTicket
                            user={props.user}
                            tickets={props.tickets}
                            title={modalAddTicketState.title}
                            ticketTypes={props.ticketTypes}
                            ticketCreateOrUpdate={props.ticketCreateOrUpdate}
                            getTickets={props.getTickets}
                            dataState={dataState}
                        />
                    </div>
                </div>
            </div>}
        </div>
    );
};


const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps, { setTicketModalState })(AccountsTable);