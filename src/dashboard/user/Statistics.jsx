import React, { useEffect, useState } from 'react';
import TableAdditionalInfo from "../../modules/TableAdditionalInfo";
import './Statistics.css'
import AccBmPagination from "./AccBmPagination";
import CircularProgress from '@mui/material/CircularProgress';
import {connect} from 'react-redux'

function Statistics(props) {
      const [isLoading, setLoaderState] = useState({id:null,state:null})
    const [accounts, setAccounts] = useState()

    useEffect(() => {
        const {page, id} = props.searchedId
        if(page === 'a' && id !== 0) {
           const searchedAccounts = props.accounts.filter(el => {
            const accountId = el.id + '';
            if(accountId.includes(id)) {
                return el
            }
           })
           
           setAccounts(searchedAccounts)
        } else {
            setAccounts(props.paginatedItems)
        }
    }, [props.accounts,props.paginatedItems])

    async function handleClick (event) {
        if(isLoading.state === true) return;
        event.persist();
        setLoaderState({id:event.target.id, state:true})
        const removeElements = event.target.id;
        if (event.target.classList.contains('opened')) {
            setLoaderState({id:null, state:false})
            const elements = event.target.parentNode.parentNode.getElementsByClassName(removeElements);
            while (elements.length > 0) elements[0].remove();
            event.target.insertAdjacentHTML('afterend', `<td colspan="18"></td>`);
            event.target.classList.remove('opened');
            event.target.parentElement.classList.remove('opened');
        } else {
            event.target.classList.add('opened');
            event.target.parentElement.classList.add('opened');
            event.target.nextSibling?.classList.add(removeElements);
            const res = await props.getStatistics(removeElements);

            if (res.data.error) {
                setLoaderState({id:null, state:false})
                event.target.nextSibling.innerHTML = res.data.error.message || 'something is wrong';
            } else {
                /*console.log(res.data);*/
                let accInfo,
                    busInfo = '';
                const account_statuses = {
                        1: 'ACTIVE',
                        2: 'DISABLED',
                        3: 'UNSETTLED',
                        7: 'PENDING_RISK_REVIEW',
                        8: 'PENDING_SETTLEMENT',
                        9: 'IN_GRACE_PERIOD',
                        100: 'PENDING_CLOSURE',
                        101: 'CLOSED',
                        201: 'ANY_ACTIVE',
                        202: 'ANY_CLOSED'
                    },
                    color_statuses = {
                        1: 'alert-success',
                        2: 'alert-danger',
                        3: 'alert-danger',
                        7: 'alert-warning',
                        8: 'alert-warning',
                        9: 'alert-dark',
                        100: 'alert-warning',
                        101: 'alert-danger',
                        201: 'alert-success',
                        202: 'alert-dark'
                    },
                    disable_reasons = ['NONE', 'ADS_INTEGRITY_POLICY', 'ADS_IP_REVIEW', 'RISK_PAYMENT', 'GRAY_ACCOUNT_SHUT_DOWN', 'ADS_AFC_REVIEW', 'BUSINESS_INTEGRITY_RAR', 'PERMANENT_CLOSE', 'UNUSED_RESELLER_ACCOUNT', 'UNUSED_ACCOUNT'];

                    res.data.forEach(el => {
                    if (!el.business) {
                        accInfo = `<td class='${removeElements}'>${el.name}</td>
                               <td class='${removeElements}'>Personal</td>
                               <td class='${removeElements}'>X</td>
                               <td class='${color_statuses[el.account_status]} ${removeElements}'>${account_statuses[el.account_status]}</td>
                               <td class='${removeElements}'>${disable_reasons[el.disable_reason]}</td>
                               <td class='${removeElements}'>${el.account_id}</td>`;
                        if (el.campaigns) {
                            el.campaigns.data.forEach((elem,i) => {
                                if (i === 0) {
                                    accInfo += returnCreativeData(elem, removeElements);
                                } else {
                                    busInfo += `<tr class='${removeElements}'>
                                        <td colspan='7'></td>
                                        ${returnCreativeData(elem)}`;
                                }
                            })
                        } else {
                            accInfo += `<td class='${removeElements}' colspan='15'></td>`;
                        }
                    } else {
                        if (!el.campaigns) {
                            busInfo += `<tr class='${removeElements}'>
                                        <td colspan='2'></td>
                                        <td>BM</td>
                                        <td>${el.business.name} ${el.business.id}</td>
                                        <td class='${color_statuses[el.account_status]}'>${account_statuses[el.account_status]}</td>
                                        <td>${disable_reasons[el.disable_reason]}</td>
                                        <td>${el.account_id}</td>
                                        <td colspan='13'></td></tr>`;
                        } else {
                            el.campaigns.data.forEach((elem,i) => {
                                if (i === 0) {
                                    busInfo += `<tr class='${removeElements}'>
                                        <td colspan='2'></td>
                                        <td>BM</td>
                                        <td>${el.business.name} ${el.business.id}</td>
                                        <td class='${color_statuses[el.account_status]}'>${account_statuses[el.account_status]}</td>
                                        <td>${disable_reasons[el.disable_reason]}</td>
                                        <td>${el.account_id}</td>`;
                                } else {
                                    busInfo += `<tr class='${removeElements}'>
                                        <td colspan='7'></td>`;
                                }
                                busInfo += returnCreativeData(elem);
                            });
                        }
                    }
                });
                setLoaderState({id:null, state:false})
                event.target.nextSibling.remove();
                event.target.insertAdjacentHTML('afterend', accInfo);
                event.target.parentNode.insertAdjacentHTML('afterend', busInfo);
            }
        }
        
    }
    function returnCreativeData (elem, id) {
        return `<td ${id && `class='${id}'`}>${TableAdditionalInfo.convertDate(elem.adsets.data[0].start_time) || 'X'}</td>
                <td ${id && `class='${id}'`}>${elem.adsets.data[0].status || 'X'}</td>
                <td ${id && `class='${id}'`}>${`<img src='${elem.adsets.data[0].adcreatives.data[0].thumbnail_url}'>` || 'X'}</td>
                <td ${id && `class='${id}'`}>X</td>
                <td ${id && `class='${id}'`}>${elem.adsets.data[0].adcreatives.data[0].object_story_spec ? (elem.adsets.data[0].adcreatives.data[0].object_story_spec.link_data.link && getHostname(elem.adsets.data[0].adcreatives.data[0].object_story_spec.link_data.link)) || 'X' : 'X'}</td>
                <td ${id && `class='${id}'`}>${elem.adsets.data[0].targeting.geo_locations.countries || 'X'}</td>
                <td ${id && `class='${id}'`}>${elem.adsets.data[0].adcreatives.data[0].object_story_spec ? `<a href='${elem.adsets.data[0].adcreatives.data[0].object_story_spec.link_data.link}'>link</a>` || 'X' : 'X'}</td>
                <td ${id && `class='${id}'`}>${(elem.daily_budget && `$ ${elem.daily_budget / 100}`) || (elem.lifetime_budget && `$ ${elem.lifetime_budget / 100}`) || 'X'}</td>
                <td ${id && `class='${id}'`}>${elem.adsets.data[0].insights ? elem.adsets.data[0].insights.data[0].cpm ? `$ ${parseFloat(elem.adsets.data[0].insights.data[0].cpm).toFixed(2)}` : 'X' : 'X'}</td>
                <td ${id && `class='${id}'`}>${elem.adsets.data[0].insights ? elem.adsets.data[0].insights.data[0].inline_link_clicks ? elem.adsets.data[0].insights.data[0].inline_link_clicks : 'X' : 'X'}</td>
                <td ${id && `class='${id}'`}>${elem.adsets.data[0].insights ? elem.adsets.data[0].insights.data[0].inline_link_click_ctr ? parseFloat(elem.adsets.data[0].insights.data[0].inline_link_click_ctr).toFixed(2) : 'X' : 'X'}</td>
                <td ${id && `class='${id}'`}>${elem.adsets.data[0].insights ? elem.adsets.data[0].insights.data[0].spend ? `$ ${elem.adsets.data[0].insights.data[0].spend}` : 'X' : 'X'}</td>
                </tr>`
    }

    function getHostname (url) {
        return new URL(url).hostname;
    }


    const accountsList = accounts?.map((el) => { 
        return <tbody key={el.id} className='ym-hide-content'>
            <tr>
                <td className='acc-id alert-info' onClick={handleClick} 
                    id={el.id}>a{el.id} {props.countries && TableAdditionalInfo.getValueById(props.countries, el.countryId)}</td>
                <td colSpan='18'>{isLoading.state === true && isLoading.id == el.id && <CircularProgress />}</td>
            </tr>
            <tr className='statistics-table-spacer'></tr>
            </tbody>
    });

    return (
        <div className='statistics'>
            <div className='statistics-header-name'>
                Statistics
            </div>
                <AccBmPagination
                    accCount={props.accCount}
                    accArchivedCount={props.accArchivedCount}
                    getUserData={props.getUserData}
                    setUserState={props.setUserState}
                    paginationType={props.archive ? 'aa' : 'a'}
                    page={props.page}
                    admin={props.admin}
                    archive={props.archive}
                    itemsToPaginate={props.accounts}
                />
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Profile</th>
                            <th>Type</th>
                            <th>BM ID</th>
                            <th>Status</th>
                            <th>Disable reason</th>
                            <th>Ad ID</th>
                            <th>Launch date</th>
                            <th>Status</th>
                            <th>Image</th>
                            <th>Note</th>
                            <th>Domain</th>
                            <th>Geo</th>
                            <th>Link</th>
                            <th>Daily spend</th>
                            <th>CPM</th>
                            <th>Clicks</th>
                            <th>CTR</th>
                            <th>Amount spend</th>
                        </tr>
                    </thead>
                    {accountsList}
                      {/* {isLoading ? progressCircle : accountsList}  */}
                </table>
        </div>
    );
};


const mapStateProps = (state) => ({
    searchedId:state.Pagination.searchedId,
    paginatedItems:state.Pagination.paginatedItems
})

export default connect(mapStateProps, {})(Statistics)