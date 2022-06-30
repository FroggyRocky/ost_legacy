import React from 'react';
import './UserMain.css'
import {Switch, Route, Redirect} from 'react-router-dom';
import BuyAccounts from './BuyAccount';
import Archive from './Archive';
import Faq from './Faq';
import Statistics from './Statistics';
import AccountsTable from './AccountsTable';
import BmTable from './BmTable';
import Settings from './Settings';
import CheckBm from "./CheckBm";
import NotFound from "../NotFound";
import Tickets from "../tickets/Tickets";
import CreateTicket from "../tickets/CreateTicket";
import TicketChat from "../tickets/TicketChat";

const UserMain = (props) => { 
    return (
        <div className='main'>
            <Switch>
                <Route
                    exact
                    path='/dashboard/'
                    render={() => <Redirect to="/dashboard/accounts/"/>}
                />
                <Route
                    path='/dashboard/accounts/'
                    render={() => <AccountsTable
                        tickets={props.tickets}
                        accounts={props.accounts}
                        statuses={props.statuses}
                        countries={props.countries}
                        getUserData={props.getUserData}
                        setUserState={props.setUserState}
                        archiveUserAccount={props.archiveUserAccount}
                        bms={props.bms}
                        bmTypes={props.bmTypes}
                        iHaveAProblem={props.iHaveAProblem}
                        freeUserBms={props.freeUserBms}
                        bindBmToAcc={props.bindBmToAcc}
                        accCount={props.accCount}
                        user={props.user}
                        proxyTraffic={props.proxyTraffic}
                        addProxyTraffic={props.addProxyTraffic}
                        ticketTypes={props.ticketTypes}
                        ticketCreateOrUpdate={props.ticketCreateOrUpdate}
                        getTickets={props.getTickets}
                    />}
                />
                <Route
                    path='/dashboard/bm/'
                    render={() => <BmTable
                        tickets={props.tickets}
                        bms={props.bms}
                        statuses={props.statuses}
                        bmTypes={props.bmTypes}
                        archiveUserBM={props.archiveUserBM}
                        getUserData={props.getUserData}
                        setUserState={props.setUserState}
                        iHaveAProblem={props.iHaveAProblem}
                        bmCount={props.bmCount}
                        user={props.user}
                        ticketTypes={props.ticketTypes}
                        ticketCreateOrUpdate={props.ticketCreateOrUpdate}
                        getTickets={props.getTickets}
                        countries={props.countries}
                    />}
                />
                <Route
                    path='/dashboard/statistics/'
                    render={() => <Statistics
                        accounts={props.accounts}
                        countries={props.countries}
                        getUserData={props.getUserData}
                        setUserState={props.setUserState}
                        accCount={props.accCount}
                        page={props.user.page}
                        getStatistics={props.getStatistics}
                    />}
                />
                <Route
                    path='/dashboard/buyaccount'
                    render={() => <BuyAccounts
                        countries={props.countries}
                        freeAccounts={props.freeAccounts}
                        buyAccount={props.buyAccount}
                        getUserData={props.getUserData}
                        setUserState={props.setUserState}
                        balance={props.user.balance}
                        freeBms={props.freeBms}
                    />}
                />
                <Route
                    path="/dashboard/archive/"
                    render={() => <Archive
                        accounts={props.accounts}
                        statuses={props.statuses}
                        countries={props.countries}
                        getUserData={props.getUserData}
                        setUserState={props.setUserState}
                        archiveUserAccount={props.archiveUserAccount}
                        bms={props.bms}
                        bmTypes={props.bmTypes}
                        archiveUserBM={props.archiveUserBM}
                        accArchivedCount={props.accArchivedCount}
                        bmArchivedCount={props.bmArchivedCount}
                        archivedAccounts={props.archivedAccounts}
                        archivedBms={props.archivedBms}
                        user={props.user}
                        accountUUID={props.accountUUID}
                        proxyTraffic={props.proxyTraffic}
                    />}
                />
                <Route
                    path="/dashboard/faq"
                    render={() => <Faq
                        faqs={props.faqs}
                        user={props.user}
                    />}
                />
                <Route
                    path="/dashboard/check-bm"
                    render={() => <CheckBm
                        checkBmLimit={props.checkBmLimit}
                    />}
                />
                <Route
                    path="/dashboard/settings"
                    render={() => <Settings
                        ru={props.user.ru}
                        auth={props.user.auth}
                        telMessages={props.user.telMessages}
                        patchUserData={props.patchUserData}
                        getUserData={props.getUserData}
                        setUserState={props.setUserState}
                        user={props.user}
                        balance={props.user.balance}
                    />}
                />
                <Route
                    exact
                    path="/dashboard/tickets"
                    render={() => <Tickets
                        ticketTypes={props.ticketTypes}
                        tickets={props.tickets}
                        getTickets={props.getTickets}
                        user={props.user}
                        messageCreate={props.messageCreate}
                    />}
                />
                <Route
                    path="/dashboard/tickets/ticket/:id"
                    render={(url) => <TicketChat
                        ticket={props.tickets.find(ticket => (ticket.id.toString() === url.match.params.id))}
                        getTickets={props.getTickets}
                        messageCreate={props.messageCreate}
                        user={props.user}
                    />}
                />
                <Route
                    exact
                    path="/dashboard/tickets/create-ticket"
                    render={() => <CreateTicket
                        ticketTypes={props.ticketTypes}
                        ticketCreateOrUpdate={props.ticketCreateOrUpdate}
                        getTickets={props.getTickets}
                    />}
                />
                <Route
                    path='*'
                    exact={true}
                    render={()=> <NotFound />}
                />
            </Switch>
        </div>
    );
};

export default UserMain;