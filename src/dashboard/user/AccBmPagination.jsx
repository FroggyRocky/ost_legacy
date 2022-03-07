import React, {useState} from 'react';
import ReactPaginate from 'react-paginate';
import DatePicker from "react-datepicker";
import {ReactComponent as Search} from '../../img/search.svg';
import {ReactComponent as Human} from '../../img/human.svg';
import {ReactComponent as Left} from '../../img/left.svg';
import {ReactComponent as Right} from '../../img/right.svg';
import {ReactComponent as Calendar} from '../../img/calendar.svg';
import './AccBmPagination.css'

const AccBmPagination = (props) => {

    const [dataState, setDataState] = useState({
        page: +props.page,
        searchId: '',
        problem: false,
        userId: '',
        approved: '',
        from: null,
        to: new Date().setHours(23, 59, 59, 999),
    });
    let pages = Math.ceil((props.bmCount || props.accCount || props.accArchivedCount || props.bmArchivedCount || props.userCount) / dataState.page);
    function setItemsPerPage(number, page, searchId, problem, userId, approved, from, to) {
        async function sendPage() {
            const adminData = await props.getUserData({[props.paginationType]: number, page: page, searchId: {[props.paginationType]: searchId}, problem: problem, userId: userId, approved: approved, from: from, to: to});
            props.setUserState(adminData.data);
        }
        sendPage().then();
    }

    function handleChange(event) {
        if (event.target.name === 'id') {
            setDataState({...dataState, searchId: event.target.value});
            setItemsPerPage(1, null, event.target.value, dataState.problem, dataState.userId, dataState.approved, dataState.from, dataState.to);
        } else if (event.target.name === 'userId') {
            setDataState({...dataState, userId: event.target.value});
            setItemsPerPage(1, null, null, dataState.problem, event.target.value, dataState.approved, dataState.from, dataState.to);
        } else if (event.target.name === 'problem') {
            setDataState({...dataState, problem: event.target.checked});
            setItemsPerPage(1, null, null, event.target.checked, dataState.userId, null, dataState.from, dataState.to);
        } else if (event.target.name === 'from') {
            setDataState({...dataState, from: event.target.date});
            setItemsPerPage(1, null, null, dataState.problem, dataState.userId, null, event.target.date, dataState.to);
        } else if (event.target.name === 'to') {
            setDataState({...dataState, to: event.target.date});
            setItemsPerPage(1, null, null, dataState.problem, dataState.userId, null, dataState.from, event.target.date);
        }else if (event.target.name === 'approved') {
            setDataState({...dataState, approved: event.target.checked});
            setItemsPerPage(1, null, dataState.searchId, event.target.checked, null, event.target.checked);
        } else {
            setDataState({...dataState, page: +event.target.value, searchId: ''});
            setItemsPerPage(1, +event.target.value, null, dataState.problem, dataState.userId, dataState.approved, dataState.from, dataState.to);
        }
    }

    return <div className='pagination'>
        <div className='pagination-text-input'>
            <div className='pagination-text-input-icon'>
                <Search/>
            </div>
            <input
                type='text'
                name='id'
                placeholder='id'
                value={dataState.searchId}
                onChange={handleChange}
                required
                maxLength="6"
            />
        </div>
        {props.admin && !props.userCount &&
        <div className='pagination-text-input'>
            <div className='pagination-text-input-icon'>
                <Human/>
            </div>
            <input
                type='text'
                name='userId'
                placeholder='user'
                value={dataState.userId}
                onChange={handleChange}
                required
                maxLength="6"
            />
        </div>}
        {props.userCount &&
        <label className='pagination-check-input'>
            <input
                type='checkbox'
                name='approved'
                onChange={handleChange}
                checked={dataState.approved}
            />
            <span className='pagination-check-input-text'>
                Users approved
            </span>
        </label>}
        <div className='pagination-text-input'>
            <div className='pagination-text-input-icon'>
                <Calendar/>
            </div>
            <DatePicker
                selected={dataState.from}
                onChange={date => handleChange({target: {date: new Date(date).setHours(0, 0, 0, 0), name: 'from'}})}
                dateFormat='dd/MM/yyyy'
                maxDate={dataState.to}
                withPortal={window.innerWidth < 960 && true}
                preventDefault={true}
                placeholderText='from'
            />
        </div>
        <div className='pagination-text-input'>
            <div className='pagination-text-input-icon'>
                <Calendar/>
            </div>
            <DatePicker
                selected={dataState.to}
                onChange={date => handleChange({target: {date: new Date(date).setHours(23, 59, 59, 999), name: 'to'}})}
                dateFormat='dd/MM/yyyy'
                minDate={dataState.from}
                withPortal={window.innerWidth < 960 && true}
                preventDefault={true}
                placeholderText='to'
            />
        </div>
        {props.admin && !props.userCount && !props.archive &&
        <label className='pagination-check-input'>
            <input
                type='checkbox'
                name='problem'
                onChange={handleChange}
                checked={dataState.problem}
            />
            <span className='pagination-check-input-text'>
                Problem accounts
            </span>
        </label>}
        <div className='pagination-area'>
            {pages > 1 ? <ReactPaginate
                previousLabel={<Left/>}
                nextLabel={<Right/>}
                breakLabel={'...'}
                pageCount={pages}
                marginPagesDisplayed={1}
                pageRangeDisplayed={3}
                onPageChange={(data) => setItemsPerPage(data.selected + 1, dataState.page, null, dataState.problem, dataState.userId, dataState.approved, dataState.from, dataState.to)}
                activeClassName={'pagination-active'}
            /> : <div></div>}
            <div>
                <select
                    name='onPage'
                    onChange={handleChange}
                    required
                    value={dataState.page}
                >
                    <option value='2'>2 on page</option>
                    <option value='25'>25 on page</option>
                    <option value='50'>50 on page</option>
                    <option value='100'>100 on page</option>
                </select>
            </div>
        </div>
    </div>
};

export default AccBmPagination;