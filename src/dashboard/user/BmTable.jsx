import React, {useState, useEffect} from 'react';
import {NavLink} from "react-router-dom";
import TableAdditionalInfo from '../../modules/TableAdditionalInfo'
import ReactTooltip from 'react-tooltip';
import AccBmPagination from './AccBmPagination'
import './BmTable.css'
import {ReactComponent as Cross} from '../../img/cross.svg';
import {ReactComponent as Clipboard} from '../../img/clipboard.svg';
import {ReactComponent as Pencil} from "../../img/pencil.svg";
import {ReactComponent as Plus} from "../../img/plus.svg";
import {ReactComponent as Folder} from "../../img/folder.svg";
import {ReactComponent as Error} from "../../img/exclamation.svg";
import AdminCreateFromExcel from "../admin/AdminCreateFromExcel";
import CreateTicket from "../tickets/CreateTicket";
import { ConstructionOutlined } from '@mui/icons-material';

const AdminBmList = (props) => {

    const [modalState, setModalState] = useState(false);
    const [modalProblemState, setModalProblemState] = useState(false);
    const [modalAddTicketState, setModalAddTicketState] = useState({
        active: false,
        title: ''
    });
    const [dataState, setDataState] = useState(null);

    useEffect(() => {
        ReactTooltip.rebuild();
    });
    const bmList = props.bms?.map(el => {
 
            const country = props.countries.filter(country => {
            return country.id === el.account?.countryId
        }).map(el => el.name)
        if ((!props.archive && !el.archived) || (props.archive && el.archived)) {
            console.log(country)
            return <tbody key={el.id}>
            <tr>
                <td>
                    <div className='bm-table-id'>
                        <div className={`bm-table-id-status ${TableAdditionalInfo.colorOfStatus(el.statusId)}`}></div>
                        BM{el.id}
                    </div>
                </td>
                <td>
                    {el.bought ? <div className='bm-table-date'>
                        <div className='bm-table-date-time'>
                            {TableAdditionalInfo.convertTime(el.bought)}
                        </div>
                        <div className='bm-table-date-date'>
                            {TableAdditionalInfo.convertDate(el.bought)}
                        </div>
                    </div> : <div className='accounts-table-center'>
                        <Cross/>
                    </div>}
                </td>
                {props.user.admin && <td  className='white'>{el.userId ? el.userId : <div className='accounts-table-center'><Cross/></div>}</td>}
                {props.user.admin && <td className='create-date'><div className='bm-table-date'>
                    <div className='bm-table-date-time'>
                        {TableAdditionalInfo.convertTime(el.createdAt)}
                    </div>
                    <div className='bm-table-date-date'>
                        {TableAdditionalInfo.convertDate(el.createdAt)}
                    </div>
                </div></td>}
                <td className='white'>{el.bmTypeId && TableAdditionalInfo.getValueById(props.bmTypes, el.bmTypeId)}</td>
                <td className='white face-bm'>{el.faceBm}</td>
                <td><div className='bm-table-copy'>{el.link1 ? <div className='bm-table-copy-icon' data-tip='Copied' id={el.link1}><Clipboard/></div> : <div className='accounts-table-center'><Cross/></div>}</div></td>
                <td className='link2'><div className='bm-table-copy'>{el.link2 ? <div className='bm-table-copy-icon' data-tip='Copied' id={el.link2}><Clipboard/></div> : <div className='accounts-table-center'><Cross/></div>}</div></td>
                <td className='link3'><div className='bm-table-copy'>{el.link3 ? <div className='bm-table-copy-icon' data-tip='Copied' id={el.link3}><Clipboard/></div> : <div className='accounts-table-center'><Cross/></div>}</div></td>
                {country ? <td className='white'>{el.account ? `${el.account.id} ${country}` : <div className='accounts-table-center'><Cross/></div>}</td> :
                <td className='white'>{el.account ? el.account.id : <div className='accounts-table-center'><Cross/></div>}</td>
            }
                {!props.user.admin && !props.archive &&
                <td className='white'>
                    <div className='bm-table-edit'>
                        <button data-id={el.id} data-name='b' disabled={el.statusId === 3} onClick={handleProblemClick}><Error/></button>
                    </div>
                </td>}
                <td>
                    {props.user.admin ?
                        props.user.permission.acc_bm_update &&
                        <div className='bm-table-edit'><NavLink to={`/dashboard/adminbmlist/edit/${el.id}`}>
                            <button><Pencil/></button>
                        </NavLink></div>
                        : <div className='bm-table-edit'><button data-id={el.id}
                                                                 onClick={handleArchiveClick}><Folder/></button></div>
                    }
                </td>
            </tr>
            <tr className='bm-table-spacer'></tr>
            </tbody>
        } else {
            return false;
        }
    });

    function handleProblemClick (event) {
        let id;
        if (event.target.tagName === 'svg') {
            id = event.target.parentElement;
        } else if (event.target.tagName === 'path') {
            id = event.target.parentElement.parentElement;
        } else {
            id = event.target;
        }
        setDataState({id: id.dataset.id, type: id.dataset.name});
        window.addEventListener('keydown', (event) => {if (event.keyCode === 27) handleProblemModalNoClick()});
        setModalProblemState(true);
    }

    function handleProblemModalNoClick () {
        window.removeEventListener('keydown', (event) => {if (event.keyCode === 27) handleProblemModalNoClick()});
        setModalProblemState(false);
    }

    function handleProblemModalYesClick() {
        async function sendProblem () {
            const res = await props.iHaveAProblem({id: dataState.id, type: dataState.type});
            const adminData = await props.getUserData();
            props.setUserState(adminData.data);
            if (res.data === 'OK') {
                await props.getTickets();
                setModalProblemState(false);
                setModalAddTicketState({active: true, title: `${dataState.type === 'a' ? 'Account' : 'BM'}: ${dataState.id}`})
            } else {
                setModalProblemState(false);
                alert('There is an error...')
            }
        }
        sendProblem().then();
    }

    function handleArchiveClick (event) {
        let id;
        if (event.target.tagName === 'svg') {
            id = event.target.parentElement;
        } else if (event.target.tagName === 'path') {
            id = event.target.parentElement.parentElement;
        } else {
            id = event.target;
        }
        setDataState(id.dataset.id);
        window.addEventListener('keydown', (event) => {if (event.keyCode === 27) handleModalNoClick()});
        setModalState(true);
    }

    function handleModalNoClick () {
        window.removeEventListener('keydown', (event) => {if (event.keyCode === 27) handleModalNoClick()});
        setModalState(false);
    }

    function handleModalYesClick () {
        async function archiveAcc () {
            const res = await props.archiveUserBM({id: dataState, archived: !props.archive});
            const adminData = await props.getUserData();
            props.setUserState(adminData.data);
            if (res.data === 'OK') {
                setModalState(false);
            } else {
                alert('There is an error...')
            }
        }
        archiveAcc().then();
    }

    function handleModalAddTicketNoClick() {
        setModalAddTicketState({
            active: false,
            title: ''
        })
    }

    return (
        <div className='bm'>
            {!props.accArchivedCount && !props.bmArchivedCount && <div className='bm-header'>
                <div className='bm-header-name'>
                    BMs
                </div>
                {props.user.admin && props.user.permission.acc_bm === 2 && props.user.permission.acc_bm_update &&
                <NavLink to={`/dashboard/adminbmlist/create/`}>
                    <div>
                        <Plus/>
                        Create BM
                    </div>
                </NavLink>}
            </div>}
            <div className='bm-admin-bar'>
                <AccBmPagination
                    bmCount={props.bmCount}
                    bmArchivedCount={props.bmArchivedCount}
                    getUserData={props.getUserData}
                    setUserState={props.setUserState}
                    paginationType={props.archive ? 'ab' : 'b'}
                    page={props.user.page}
                    admin={props.user.admin}
                    archive={props.archive}
                />
                {props.user.admin && props.user.permission.acc_bm_update && !props.archive && <AdminCreateFromExcel
                    bmTypes={props.bmTypes}
                    bmCount={props.bmCount}
                    getUserData={props.getUserData}
                    setUserState={props.setUserState}
                    bmBulkCreate={props.bmBulkCreate}
                    user={props.user}
                />}
            </div>
            <table className='bm-table'>
                <thead>
                <tr>
                    <th>
                        ID
                        <ReactTooltip    effect="solid" event='click' delayHide={400}
                                      afterShow={(evt) => TableAdditionalInfo.copyText(evt)}/>
                    </th>
                    <th>Purchase</th>
                    {props.user.admin && <th>User</th>}
                    {props.user.admin && <th className='create-date'>Created</th>}
                    <th>Type</th>
                    <th className='face-bm'>BM ID</th>
                    <th>Link 1</th>
                    <th className='link2'>Link 2</th>
                    <th className='link3'>Link 3</th>
                    <th>Account</th>
                    {!props.user.admin && !props.archive && <th>Problem</th>}
                    <th>{!props.user.admin && 'Archive'}</th>
                </tr>
                </thead>
                {bmList}
            </table>
            {!props.user.admin && modalProblemState && <div className='modal'>
                <div className='modal-window'>
                    <div className='modal-window-close' onClick={handleProblemModalNoClick}>
                        <Cross/>
                    </div>
                    <div className='modal-window-data'>
                        Do you have problems with that BM?
                    </div>
                    <div className='modal-window-yes-no'>
                        <button onClick={handleProblemModalNoClick} className='mb-4 mr-5'>NO</button>
                        <button onClick={handleProblemModalYesClick} className='mb-4'>YES</button>
                    </div>
                </div>
            </div>}
            {!props.user.admin && modalState && <div className='modal'>
                <div className='modal-window'>
                    <div className='modal-window-close' onClick={handleModalNoClick}>
                        <Cross/>
                    </div>
                    <div className='modal-window-data'>
                        {props.archive ? 'Do you really want to remove that BM from archive?' :
                            'Do you really want to move that BM to archive?'}
                    </div>
                    <div className='modal-window-yes-no'>
                        <button onClick={handleModalNoClick}>NO</button>
                        <button onClick={handleModalYesClick}>YES</button>
                    </div>
                </div>
            </div>}
            {modalAddTicketState.active && <div className='modal'>
                <div className='modal-window modal-window--create-ticket'>
                    <div className='modal-window-close' onClick={handleModalAddTicketNoClick}>
                        <Cross/>
                    </div>
                    <div className='modal-window-data'>
                        <CreateTicket
                            title={modalAddTicketState.title}
                            ticketTypes={props.ticketTypes}
                            ticketCreateOrUpdate={props.ticketCreateOrUpdate}
                            getTickets={props.getTickets}
                        />
                    </div>
                </div>
            </div>}
        </div>
    )
};

export default AdminBmList;