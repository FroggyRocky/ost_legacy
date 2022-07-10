import React, {useEffect, useState} from 'react';
import ReactPaginate from 'react-paginate';
import DatePicker from "react-datepicker";
import {ReactComponent as Search} from '../../img/search.svg';
import {ReactComponent as Human} from '../../img/human.svg';
import {ReactComponent as Calendar} from '../../img/calendar.svg';
import { ReactComponent as Left } from '../../img/left.svg';
import { ReactComponent as Right } from '../../img/right.svg';
import {connect} from 'react-redux';
import {getPaginatedItems, paginationActions} from "../../Redux/Reducers/pagination";


import './AccBmPagination.css'

const AccBmPagination = (props) => {
    const [dataState, setDataState] = useState({
        searchId: '',
        problem: false,
        userId: '',
        approved: '',
        from: null,
        to: new Date().setHours(23, 59, 59, 999),
    });

    const [usersPerPage, setUsersPerPage] = useState(+props.page)
    const [pagesAmount, setPagesAmount] = useState();
    const [currentPage, setCurrentPage] = useState(0)
    useEffect(() => {
        props.setSeacrhedId(null, null)
    }, [])

    useEffect(() => {
        if(props.itemsToPaginate) {
            props.getPaginatedItems(props.itemsToPaginate, usersPerPage, currentPage)
            setPagesAmount(Math.ceil(+props.itemsToPaginate.length / +usersPerPage))
        }
    }, [usersPerPage, currentPage])



    useEffect(() => {
        if(props.itemsToPaginate) {
            setPagesAmount(Math.ceil(+props.itemsToPaginate?.length / +usersPerPage))
            props.getPaginatedItems(props.itemsToPaginate, usersPerPage, currentPage)
        }
    }, [props.itemsToPaginate])


    function changeUserPerPage(e) {
        const val = +e.target.value
        setUsersPerPage(val)

    }

    function handlePageChange({selected}) {
        setCurrentPage(selected)
    }

    function setItemsPerPage(number, page, searchId, problem, userId, approved, from, to) {
        async function sendPage() {

            props.setSeacrhedId(props.paginationType, +searchId)
            const adminData = await props.getUserData({
                [props.paginationType]: number,
                page: page,
                problem: problem,
                userId: userId,
                approved: approved,
                from: from,
                to: to
            });

            props.setUserState(adminData.data);
        }

        sendPage().then();
    }

    function handleChange(event) {
        if (event.target.name === 'id') {
            setCurrentPage(0)
            setDataState({...dataState, searchId: event.target.value});
            setItemsPerPage(1, null, event.target.value, dataState.problem, dataState.userId, dataState.approved, dataState.from, dataState.to);
        } else if (event.target.name === 'userId') {
            setCurrentPage(0)
            setDataState({...dataState, userId: event.target.value});
            setItemsPerPage(1, null, null, dataState.problem, event.target.value, dataState.approved, dataState.from, dataState.to);
        } else if (event.target.name === 'problem') {
            setCurrentPage(0)
            setDataState({...dataState, problem: event.target.checked});
            setItemsPerPage(1, null, null, event.target.checked, dataState.userId, null, dataState.from, dataState.to);
        } else if (event.target.name === 'from') {
            setCurrentPage(0)
            setDataState({...dataState, from: event.target.date});
            setItemsPerPage(1, null, null, dataState.problem, dataState.userId, null, event.target.date, dataState.to);
        } else if (event.target.name === 'to') {
            setCurrentPage(0)
            setDataState({...dataState, to: event.target.date});
            setItemsPerPage(1, null, null, dataState.problem, dataState.userId, null, dataState.from, event.target.date);
        } else if (event.target.name === 'approved') {
            setCurrentPage(0)
            setDataState({...dataState, approved: event.target.checked});
            setItemsPerPage(1, null, dataState.searchId, event.target.checked, null, event.target.checked);
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
                value={!props.searchedId.id ? '' : props.searchedId.id}
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

        {props.paginationType === 'u' && <label className='pagination-check-input'>
            <input
                type='checkbox'
                name='approved'
                onChange={handleChange}
                checked={dataState.approved}
            />
            <span className='pagination-check-input-text'>
                Unapproved
            </span>
        </label>
        }
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
        {
            // props.admin &&
            !props.userCount && !props.archive &&
            <label className='pagination-check-input'>
                <input
                    type='checkbox'
                    name='problem'
                    onChange={handleChange}
                    checked={dataState.problem}
                />
                <span className='pagination-check-input-text'>
                   {props?.type === 'bm' ? 'Problem Bms' : 'Problem Accounts'}
                </span>
            </label>}
        <div className='pagination-area'>
            {(pagesAmount > 1 && !props.searchedId.id && !dataState.problem) ? <ReactPaginate
                pageCount={pagesAmount}
                onPageChange={handlePageChange}
                nextLabel={<Right />}
                previousLabel={<Left />}
                breakLabel={'...'}
                marginPagesDisplayed={1}
                pageRangeDisplayed={3}
                activeClassName={'pagination-active'}
            /> : <div></div> }

            <div>
                <select
                    name='onPage'
                    onChange={changeUserPerPage}
                    required
                    value={usersPerPage}
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


const mapStateProps = (state) => ({
    searchedId: state.Pagination.searchedId
})

export default connect(mapStateProps, {
    setSeacrhedId: paginationActions.setSeacrhedId,
    getPaginatedItems
})(AccBmPagination)
