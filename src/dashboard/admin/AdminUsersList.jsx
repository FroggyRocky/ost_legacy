import React from 'react';
import './AdminUsersList.css'
import {NavLink} from "react-router-dom";
import ReactTooltip from 'react-tooltip';
import AccBmPagination from "../user/AccBmPagination";
import TableAdditionalInfo from "../../modules/TableAdditionalInfo";
import {ReactComponent as Telegram} from '../../img/telegram.svg';
import {ReactComponent as Skype} from '../../img/skype.svg';
import {ReactComponent as Cross} from '../../img/cross.svg';
import {ReactComponent as Pencil} from "../../img/pencil.svg";
import {ReactComponent as Tick} from '../../img/tick.svg';

const AdminUserList = (props) => {
    // Вставить функцию из доп функций таблицы
    function convertDate (date) {
        const formattedDate = new Date(Date.parse(date));
        return formattedDate.toLocaleDateString('ru-RU');
    }

    function handleClick(event) {
        event.preventDefault();
        let id;
        if (event.target.tagName === 'svg') {
            id = event.target.parentElement;
        } else if (event.target.tagName === 'path') {
            id = event.target.parentElement.parentElement;
        } else {
            id = event.target;
        }
        async function makeUserApproved() {
            const res = await props.approveUser(id.dataset.id);
            const adminData = await props.getUserData();
            props.setUserState(adminData.data);
            if (res.data !== 'OK') {
                console.log(res.data);
            }
        }
        makeUserApproved().then()
    }

    const userList = props.userList?.map(el => {
        return <tbody key={el.id}>
            <tr>
                <td>
                    <div className='user-list-table-id'>
                        <div className={`user-list-table-id-status ${el.approved ? el.active ? TableAdditionalInfo.colorOfStatus(1) : TableAdditionalInfo.colorOfStatus(3) : TableAdditionalInfo.colorOfStatus(2)}`}></div>
                        {el.id}
                    </div>
                </td>
                <td className={`email ${el.email_confirmed ? 'text-green' : 'text-red'}`}>{el.email}</td>
                <td>$ {el.balance}</td>
                <td>
                    <div className='user-list-table-messenger'>
                        {el.telegram ? <div className='copy' data-tip='Copied' id={el.telegram}><Telegram/></div> : <div><Cross/></div>}
                        {el.skype ? <div className='copy' data-tip='Copied' id={el.skype}><Skype/></div> : <div><Cross/></div>}
                    </div>
                </td>
                <td className='country'>{el.country ? el.country : <Cross/>}</td>
                <td className='manager-id'>{el.managerId}</td>
                <td className='admin'>{el.admin ? <Tick/> : <Cross/>}</td>
                <td className='user-list-manager'>{el.manager ?
                    <div className='user-list-table-manager'>
                        <div>{el.name ? el.name : 'не указано'}</div>
                        <div>{el.works ? el.works : 'не указано'}</div>
                    </div>
                    /*<FontAwesomeIcon
                        data-tip={`Имя: ${el.name ? el.name : 'не указано'}<br/>Время: $`}
                        icon={faClipboardCheck}
                        size='lg'/>*/
                    : <Cross/>
                }</td>
                {/*<td>{el.active ? <Tick/> : <Cross/>}</td>*/}
                <td>{convertDate(el.createdAt)}</td>
                <td>{el.approved ? <Tick/> : (props.user.admin && props.user.permission.user_update &&
                        <div className='user-list-table-icon'>
                                <div data-id={el.id} onClick={handleClick}><Tick/></div>
                        </div>) || <Cross/>}
                </td>
                {props.user.admin && props.user.permission.user_update && <td>
                    <div className='user-list-table-icon edit'>
                        {el.approved && <NavLink to={`/dashboard/adminuserlist/${el.id}`}>
                            <div><Pencil/></div>
                        </NavLink>}
                    </div>
                </td>}
            </tr>
            <tr className='user-list-table-spacer'></tr>
        </tbody>
    });
    return (
        <div className='user-list'>
            <div className='user-list-header-name'>
                Users
            </div>
            <div className='user-list-bar'>
                <AccBmPagination
                    getUserData={props.getUserData}
                    setUserState={props.setUserState}
                    paginationType={'u'}
                    page={props.user.page}
                    userCount={props.userCount}
                />
            </div>
            <table className='user-list-table'>
                <thead>
                <tr>
                    <th>ID</th>
                    <th className='email'>Email</th>
                    <th>Balance</th>
                    <th>Messenger</th>
                    <th className='country'>Country</th>
                    <th className='manager-id'>Manager ID</th>
                    <th className='admin'>Admin</th>
                    <th className='user-list-manager'>Manager</th>
                    {/*<th>Active</th>*/}
                    <th>Registered</th>
                    <th>Approved</th>
                    {props.user.admin && props.user.permission.user_update && <th></th>}
                </tr>
                </thead>
                {userList}
            </table>
            <ReactTooltip effect="solid" event='click' delayHide={400}
                          afterShow={(evt) => TableAdditionalInfo.copyText(evt)}/>
        </div>
    )};

export default AdminUserList;