import React from 'react';
import {NavLink, Redirect, Route, Switch} from "react-router-dom";
import AccountsTable from "./AccountsTable";
import BmTable from "./BmTable";
import './Archive.css'

const Archive = (props) => {

    async function fetchData() {
        const adminData = await props.getUserData();
        props.setUserState(adminData.data);
    }
    return (
        <div className='archive'>
            <div className='archive-header-name'>
                Archive
            </div>
            <div className='archive-buttons'>
                <NavLink activeClassName='active-button' to={`/dashboard/archive/accounts`} onClick={fetchData}>
                    Accounts
                </NavLink>
                <NavLink activeClassName='active-button' to={`/dashboard/archive/bms`} onClick={fetchData}>
                    BM's
                </NavLink>
            </div>
            <Switch>
                <Route
                    exact
                    path='/dashboard/archive/'
                    render={() => <Redirect to="/dashboard/archive/accounts"/>}
                />
                <Route
                    exact
                    path='/dashboard/archive/accounts'
                    render={() => <AccountsTable
                        archive={true}
                        accounts={props.archivedAccounts}
                        statuses={props.statuses}
                        countries={props.countries}
                        getUserData={props.getUserData}
                        setUserState={props.setUserState}
                        archiveUserAccount={props.archiveUserAccount}
                        bmTypes={props.bmTypes}
                        accArchivedCount={props.accArchivedCount}
                        archivedAccounts={props.archivedAccounts}
                        user={props.user}
                        page={props.user.page}
                        accountUUID={props.accountUUID}
                        proxyTraffic={props.proxyTraffic}
                    />}
                />
                <Route
                    exact
                    path='/dashboard/archive/bms'
                    render={() => <BmTable
                        archive={true}
                        bms={props.archivedBms}
                        statuses={props.statuses}
                        bmTypes={props.bmTypes}
                        archiveUserBM={props.archiveUserBM}
                        getUserData={props.getUserData}
                        setUserState={props.setUserState}
                        bmArchivedCount={props.bmArchivedCount}
                        archivedBms={props.archivedBms}
                        user={props.user}
                        page={props.user.page}
                    />}
                />
            </Switch>
        </div>
    );
};

export default Archive;