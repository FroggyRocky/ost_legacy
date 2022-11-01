import React, {useCallback, useEffect, useRef, useState} from 'react';
import './Dashboard.css'
import UserMain from './user/UserMain';
import Menu from "./Menu";
import UserAPI from '../api/UserAPI'
import AdminAPI from '../api/AdminAPI'
import {Redirect} from 'react-router-dom'
import AdminMain from './admin/AdminMain'
import {connect} from "react-redux";
import {checkBalanceTicketTransfer, setUserTickets} from "../Redux/Reducers/tickets";


const Dashboard = (props) => {
    const [userState, setUserState] = useState(null);
    const [redirectState, setRedirectState] = useState(false);
    const dashboard = useRef()

    function checkToken() {
        if (!localStorage.getItem('token') && !sessionStorage.getItem('token')) setRedirectState(true)
    }

    const getTickets = useCallback(async () => {
        const tickets = await AdminAPI.getTickets();
        return setUserState(state => ({...state, ...tickets.data}));
    }, []);


    useEffect(() => {
        if (userState) {
            props.getUnreadTickets(userState?.tickets, userState.user?.id)
            if (userState.tickets && userState.tickets?.length !== 0) {
                props.checkBalanceTicketTransfer(userState.tickets)
            }
        }
    }, [userState?.tickets, userState])

    useEffect(() => {
        checkToken();
        async function fetchData() {
            const res = await UserAPI.getUserData();
            if (res.data === 'clear') {
                localStorage.clear();
                sessionStorage.clear();
                setRedirectState(true);
            } else {
                const tickets = await AdminAPI.getTickets();
                // props.getUnreadTickets(tickets.data.tickets, res.data.user.id)
                setUserState({...res.data, ...tickets.data});
            }
        }

        fetchData().then();
    }, [getTickets]);

    return (userState && userState.user?.active) ? (
        <div ref={dashboard} className='dashboard'>

            {/* {console.log(userState)} */}
            {redirectState && <div><Redirect to='/login'/></div>}
            <div className='dashboard-menu full'>
                <Menu manager={userState.manager}
                      admin={userState.user.admin}
                      getUserData={UserAPI.getUserData}
                      setUserState={setUserState}
                      user={userState.user}
                      dashboardRef={dashboard}
                />
            </div>
            {!userState.user.admin ?
                <UserMain
                    faqs={userState.faqs}
                    accounts={userState.accounts}
                    user={userState.user}
                    patchUserData={UserAPI.patchUserData}
                    getUserData={UserAPI.getUserData}
                    buyAccount={UserAPI.buyAccount}
                    setUserState={setUserState}
                    statuses={userState.statuses}
                    countries={userState.countries}
                    archiveUserAccount={UserAPI.archiveUserAccount}
                    freeAccounts={userState.freeAccounts}
                    freeBms={userState.freeBms}
                    bms={userState.bms}
                    bmTypes={userState.bmTypes}
                    archiveUserBM={UserAPI.archiveUserBM}
                    iHaveAProblem={UserAPI.iHaveAProblem}
                    freeUserBms={userState.freeUserBms}
                    bindBmToAcc={UserAPI.bindBmToAcc}
                    accCount={userState.accCount}
                    bmCount={userState.bmCount}
                    accArchivedCount={userState.accArchivedCount}
                    bmArchivedCount={userState.bmArchivedCount}
                    archivedAccounts={userState.archivedAccounts}
                    archivedBms={userState.archivedBms}
                    getStatistics={UserAPI.getStatistics}
                    accountUUID={AdminAPI.accountUUID}
                    proxyTraffic={UserAPI.proxyTraffic}
                    checkBmLimit={UserAPI.checkBmLimit}
                    addProxyTraffic={UserAPI.addProxyTraffic}
                    getTickets={getTickets}
                    ticketTypes={userState.ticketTypes}
                    tickets={userState.tickets}
                    messageCreate={AdminAPI.messageCreate}
                    ticketCreateOrUpdate={AdminAPI.ticketCreateOrUpdate}
                />
                : <AdminMain
                    logList={userState.logList}
                    user={userState.user}
                    statuses={userState.statuses}
                    countries={userState.countries}
                    faqs={userState.faqs}
                    accounts={userState.accounts}
                    accCreateOrUpdate={AdminAPI.accCreateOrUpdate}
                    faqCreateOrUpdate={AdminAPI.faqCreateOrUpdate}
                    faqDelete={AdminAPI.faqDelete}
                    getUserData={UserAPI.getUserData}
                    setUserState={setUserState}
                    userList={userState.userList}
                    adminUserUpdate={AdminAPI.adminUserUpdate}
                    countryCreateOrUpdate={AdminAPI.countryCreateOrUpdate}
                    dashboard={userState.dashboard}
                    bmTypes={userState.bmTypes}
                    bms={userState.bms}
                    bmCreateOrUpdate={AdminAPI.bmCreateOrUpdate}
                    bmTypeCreateOrUpdate={AdminAPI.bmTypeCreateOrUpdate}
                    accCount={userState.accCount}
                    bmCount={userState.bmCount}
                    accArchivedCount={userState.accArchivedCount}
                    bmArchivedCount={userState.bmArchivedCount}
                    archivedAccounts={userState.archivedAccounts}
                    archivedBms={userState.archivedBms}
                    userCount={userState.userCount}
                    getStatistics={UserAPI.getStatistics}
                    approveUser={AdminAPI.approveUser}
                    accBulkCreate={AdminAPI.accBulkCreate}
                    bmBulkCreate={AdminAPI.bmBulkCreate}
                    accountUUID={AdminAPI.accountUUID}
                    proxyTraffic={UserAPI.proxyTraffic}
                    proxyData={AdminAPI.proxyData}
                    patchUserData={UserAPI.patchUserData}
                    managerList={userState.managerList}
                    addProxyTraffic={UserAPI.addProxyTraffic}
                    getTickets={getTickets}
                    ticketTypes={userState.ticketTypes}
                    tickets={userState.tickets}
                    ticketTypeCreateOrUpdate={AdminAPI.ticketTypeCreateOrUpdate}
                    ticketCreateOrUpdate={AdminAPI.ticketCreateOrUpdate}
                    messageCreate={AdminAPI.messageCreate}
                    skip={AdminAPI.skip}
                />
            }
        </div>
    ) : (
        <div className='spinner'>
            {redirectState && <div><Redirect to='/login'/></div>}
            <div className='loader'>Loading...</div>
        </div>
    )
};
const mapStateToProps = (state) => ({})
export default connect(mapStateToProps, {
    setUserTickets,
    checkBalanceTicketTransfer
})(Dashboard);
