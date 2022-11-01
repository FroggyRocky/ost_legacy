import React, {useState} from 'react';
import TableAdditionalInfo from '../../modules/TableAdditionalInfo';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './AdminLog.css';
import Skip from './Skip';
import {ReactComponent as Calendar} from '../../img/calendar.svg';
import {ReactComponent as Human} from '../../img/human.svg';
import {ReactComponent as Money} from '../../img/money.svg';
import {ReactComponent as Basket} from '../../img/basket.svg';
import {ReactComponent as Refresh} from '../../img/refresh.svg';
import {ReactComponent as Plus} from '../../img/plus.svg';
import {ReactComponent as Right} from '../../img/right.svg';

const AdminLog = (props) => {
    const [searchState, setSearchState] = useState({
        from: new Date().setDate(new Date().getDate() - 7),
        to: new Date().setHours(23, 59, 59, 999),
        operation: '0',
        userId: ''
    });

    const logList = props.logList?.map(el => {
        return <tbody key={el.id}>
            <tr>
                <td>
                    <div>
                        {TableAdditionalInfo.convertTime(el.createdAt)}
                    </div>
                    <div className='log-table-date'>
                        {TableAdditionalInfo.convertDate(el.createdAt)}
                    </div>
                </td>
                <td>{el.owner}</td>
                <td className='arrow'>
                    <div className='log-table-center'>
                        <Right/>
                    </div>
                    </td>
                <td>{el.receiver}</td>
                <td className='log-operation'>{TableAdditionalInfo.operationType(el.operation)}</td>
                <td  className='log-description' dangerouslySetInnerHTML={{__html: el.description}}></td>
                <td>{el.amount && `$ ${el.amount}`}</td>
            </tr>
            <tr className='log-table-spacer'></tr>
        </tbody>
    });

    function handleChange(event) {
        if (event.target.name === 'from') {
            setSearchState({...searchState, [event.target.name]: new Date(event.target.value).setHours(0, 0, 0, 0)})
        } else if (event.target.name === 'to') {
            setSearchState({...searchState, [event.target.name]: new Date(event.target.value).setHours(23, 59, 59, 999)})
        } else {
            setSearchState({...searchState, [event.target.name]: event.target.value})
        }

    }
    function handleButtonClick(number) {
        setSearchState({...searchState, operation: number})
    }
    function handleClick() {
        async function sendSearchState() {
            const adminData = await props.getUserData({searchState});
            props.setUserState(adminData.data);
        }
        sendSearchState().then();
    }

    return (
        <div className='log ym-hide-content'>
            <div className='log-header-name'>
                Log
            </div>
            Accounts Available: <b>{props.dashboard.freeAccounts}</b>
            <br/>
            New Accounts in System: <b>{props.dashboard.newAccounts}</b>
            <br/>
            New Users: <b>{props.dashboard.newUsers}</b>
            {props.user.id === 1 && <Skip skip={props.skip}/>}
            <div className='log-buttons'>
                <div className={searchState.operation === '0' ? 'active' : undefined} onClick={() => handleButtonClick('0')}>All</div>
                <div className={searchState.operation === '1' ? 'active' : undefined} onClick={() => handleButtonClick('1')}><Money/>Balance</div>
                <div className={searchState.operation === '2' ? 'active' : undefined} onClick={() => handleButtonClick('2')}><Basket/>Purchase</div>
                <div className={searchState.operation === '3' ? 'active' : undefined} onClick={() => handleButtonClick('3')}><Refresh/>Replacement</div>
                <div className={searchState.operation === '4' ? 'active' : undefined} onClick={() => handleButtonClick('4')}><Plus/>Additions</div>
                <div className={searchState.operation === '5' ? 'active' : undefined} onClick={() => handleButtonClick('5')}><Human/>Registration</div>
                <div className={searchState.operation === '6' ? 'active' : undefined} onClick={() => handleButtonClick('6')}><Human/>Ticket Created</div>
            </div>
            <div className='log-search'>
                <div className='log-search-td'>
                    <div className='log-search-td-name'>
                        Date from
                    </div>
                    <div className='log-search-td-data'>
                        <DatePicker
                            className='text-input'
                            selected={searchState.from}
                            onChange={date => setSearchState({...searchState, from: date})}
                            dateFormat='dd/MM/yyyy'
                            maxDate={searchState.to}
                            withPortal={window.innerWidth < 960 && true}
                            preventDefault={true}
                        />
                        <span><Calendar/></span>
                    </div>
                </div>
                <div className='log-search-td'>
                    <div className='log-search-td-name'>
                        Date to
                    </div>
                    <div className='log-search-td-data'>
                        <DatePicker
                            className='text-input'
                            selected={searchState.to}
                            onChange={date => setSearchState({...searchState, to: date})}
                            dateFormat='dd/MM/yyyy'
                            minDate={searchState.from}
                            withPortal={window.innerWidth < 960 && true}
                            preventDefault={true}
                        />
                        <span><Calendar/></span>
                    </div>
                </div>
                <div className='log-search-td'>
                    <div className='log-search-td-name'>
                    </div>
                    <div className='log-search-td-data'>
                        <span><Human/></span>
                        <input
                            className='text-input'
                            type='text'
                            name='userId'
                            placeholder='id'
                            value={searchState.userId}
                            onChange={handleChange}
                            maxLength="4"
                        />
                    </div>
                </div>
                <div className='log-search-td'>
                    <div className='log-search-td-name'>
                    </div>
                    <button className='log-search-show' onClick={handleClick}>
                        Show
                    </button>

                </div>
            </div>
            <table>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Admin</th>
                    <th className='arrow'></th>
                    <th>User</th>
                    <th>Operation</th>
                    <th>Description</th>
                    <th>Amount</th>
                </tr>
                </thead>
                {logList}
            </table>
        </div>
    )
};

export default AdminLog;