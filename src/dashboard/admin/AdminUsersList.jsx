import React, {useEffect, useState} from 'react';
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
import {connect} from "react-redux";


const AdminUserList = (props) => {

const [users, setUsers] = useState()
const [isUnApprovedUsersHidden, setUnApprovedUsersState] = useState(true)
    useEffect(() => {
        const {page, id} = props.searchedId
        if (page === 'u' && id) {
            const searchedAccounts = filterBySearchId(id, props.userList, isUnApprovedUsersHidden)
            setUsers(searchedAccounts)
        } else if(isUnApprovedUsersHidden) {
            const filteredUsers = props.userList.filter(el => el.approved === true);
            setUsers(filteredUsers)
        }
        else {
            setUsers(props.paginatedItems)
        }
    }, [props.userList, props.paginatedItems, isUnApprovedUsersHidden])

    function filterBySearchId(id, items, isUnApprovedUsersHidden) {
        let searchedAccounts = items.filter(el => {
            const accountId = el.id + '';
            if (accountId.includes(id)) {
                return el
            }
        })
        if(isUnApprovedUsersHidden) {
            searchedAccounts = searchedAccounts.filter(el => el.approved === true)
        }
        return searchedAccounts
    }

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

    const userList = users?.map(el => {
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
                <td className='manager-id'>
                    <div className='user-list-table-manager'>
                        {props.managerList.find(manager => manager.id === el.managerId)?.name || ''}
                    </div>
                </td>
                <td className='admin'>{el.admin ? <Tick/> : <Cross/>}</td>
                <td className='user-list-manager'>{el.manager ?
                    <div className='user-list-table-manager'>
                        <div>{el.name ? el.name : ''}</div>
                        <div>{el.works ? el.works : ''}</div>
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
                    itemsToPaginate={props.userList}
                    setUnApprovedUsersState={setUnApprovedUsersState}
                    isUnApprovedUsersHidden={isUnApprovedUsersHidden}
                />
            </div>
            <table className='user-list-table ym-hide-content'>
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

const mapStateToProps = (state) => ({
    searchedId: state.Pagination.searchedId,
    paginatedItems: state.Pagination.paginatedItems,
    updateAllTrafficError:state.Pagination.updateAllTrafficError
})
export default connect(mapStateToProps, {})(AdminUserList);