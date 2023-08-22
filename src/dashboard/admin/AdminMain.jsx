import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Faq from '../user/Faq';
import AdminUserList from "./AdminUsersList";
import AdminCreateAcc from './AdminCreateAcc';
import AdminEditUser from "./AdminEditUser";
import AdminCreateFAQ from "./AdminCreateFAQ";
import AdminAddCountry from "./AdminAddCountry";
import Settings from "../user/Settings";
import AdminPriceList from "./AdminPriceList";
import AdminAddBmType from "./AdminAddBmType";
import AdminCreateBm from "./AdminCreateBm";
import Archive from "../user/Archive";
import Statistics from "../user/Statistics";
import AdminLog from "./AdminLog";
import AccountsTable from "../user/AccountsTable";
import BmTable from "../user/BmTable"
import NotFound from "../NotFound";
import Tickets from "../tickets/Tickets";
import AdminTicketTypes from "../tickets/AdminTicketTypes";
import AdminEditTicketType from "../tickets/AdminEditTicketType";
import CreateTicket from "../tickets/CreateTicket";
import TicketChat from "../tickets/TicketChat";
import AddReq from './Requisites/AddReq'
import MailContainer from './Mail/MailContainer'

const AdminMain = (props) => {
    return (
        <div className='main'>
            <Switch>
                <Route
                    exact
                    path='/dashboard/'
                    render={() => <Redirect to={(props.user.admin && props.user.permission.acc_bm !== 0 && '/dashboard/adminacclist') || '/dashboard/adminfaq'}/>}
                />
                {props.user.admin && props.user.permission.users !== 0 && <Route
                    exact
                    path='/dashboard/adminuserlist'
                    render={() => <AdminUserList
                        userList={props.userList}
                        getUserData={props.getUserData}
                        setUserState={props.setUserState}
                        user={props.user}
                        userCount={props.userCount}
                        approveUser={props.approveUser}
                        managerList={props.managerList}
                    />}
                />}
                 {props.user.admin && props.user.permission.users !== 0 && <Route
                    exact
                    path='/dashboard/mail'
                    render={() => <MailContainer />}
                />}
                {props.user.admin && props.user.permission.acc_bm !== 0 && <Route
                    exact
                    path='/dashboard/adminbmlist'
                    render={() => <BmTable
                        tickets={props.tickets}
                        bms={props.bms}
                        statuses={props.statuses}
                        bmTypes={props.bmTypes}
                        bmCount={props.bmCount}
                        getUserData={props.getUserData}
                        setUserState={props.setUserState}
                        page={props.user.page}
                        bmBulkCreate={props.bmBulkCreate}
                        user={props.user}
                        countries={props.countries}
                    />}
                />}
                {props.user.admin && props.user.permission.acc_bm_update && <Route
                    exact
                    path='/dashboard/adminbmlist/create'
                    render={() => <AdminCreateBm
                        bmCreateOrUpdate={props.bmCreateOrUpdate}
                        bmTypes={props.bmTypes}
                        statuses={props.statuses}
                        getUserData={props.getUserData}
                        setUserState={props.setUserState}
                        user={props.user}
                    />}
                />}
                {props.user.admin && props.user.permission.acc_bm_update && <Route
                    path='/dashboard/adminbmlist/edit/:bmid'
                    render={(url) => <AdminCreateBm
                        bm={props.bms.find(bm => (bm.id.toString() === url.match.params.bmid))}
                        bmCreateOrUpdate={props.bmCreateOrUpdate}
                        statuses={props.statuses}
                        bmTypes={props.bmTypes}
                        getUserData={props.getUserData}
                        setUserState={props.setUserState}
                    />}
                />}
                {props.user.admin && props.user.permission.acc_bm !== 0 && <Route
                    exact
                    path='/dashboard/adminacclist'
                    render={() => <AccountsTable
                        tickets={props.tickets}
                        accounts={props.accounts}
                        statuses={props.statuses}
                        countries={props.countries}
                        bms={props.bms}
                        bmTypes={props.bmTypes}
                        accCount={props.accCount}
                        getUserData={props.getUserData}
                        setUserState={props.setUserState}
                        page={props.user.page}
                        accBulkCreate={props.accBulkCreate}
                        user={props.user}
                        accountUUID={props.accountUUID}
                        proxyTraffic={props.proxyTraffic}
                        proxyData={props.proxyData}
                        addProxyTraffic={props.addProxyTraffic}
                    />}
                />}
                {props.user.admin && props.user.permission.statistics && <Route
                    exact
                    path='/dashboard/statistics'
                    render={() => <Statistics
                        accounts={props.accounts}
                        countries={props.countries}
                        accCount={props.accCount}
                        getUserData={props.getUserData}
                        setUserState={props.setUserState}
                        page={props.user.page}
                        admin={true}
                        getStatistics={props.getStatistics}
                    />}
                />}
                {props.user.admin && props.user.permission.acc_bm !== 0 && <Route
                    path="/dashboard/archive/"
                    render={() => <Archive
                        statuses={props.statuses}
                        countries={props.countries}
                        getUserData={props.getUserData}
                        setUserState={props.setUserState}
                        archiveUserAccount={props.archiveUserAccount}
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
                />}
                {props.user.admin && props.user.permission.acc_bm_update && <Route
                    exact
                    path='/dashboard/adminacclist/create'
                    render={() => <AdminCreateAcc
                        accCreateOrUpdate={props.accCreateOrUpdate}
                        statuses={props.statuses}
                        countries={props.countries}
                        getUserData={props.getUserData}
                        setUserState={props.setUserState}
                        user={props.user}
                        account = {null}
                    />}
                />}
                {props.user.admin && props.user.permission.acc_bm_update && <Route
                    path='/dashboard/adminacclist/edit/:accid'
                    render={(url) => <AdminCreateAcc
                        account={props.accounts.find(acc => (acc.id.toString() === url.match.params.accid)) || props.archivedAccounts.find(acc => (acc.id.toString() === url.match.params.accid))}
                        accCreateOrUpdate={props.accCreateOrUpdate}
                        statuses={props.statuses}
                        countries={props.countries}
                        getUserData={props.getUserData}
                        setUserState={props.setUserState}
                    />}
                />}
                {props.user.admin && props.user.permission.user_update && <Route
                    path='/dashboard/adminuserlist/:userid'
                    render={(url) => <AdminEditUser
                        user={props.userList.find(user => (user.id.toString() === url.match.params.userid))}
                        adminUserUpdate={props.adminUserUpdate}
                        getUserData={props.getUserData}
                        setUserState={props.setUserState}
                        userCurrent={props.user}
                        managerList={props.managerList}
                    />}
                />}
                {props.user.admin && props.user.permission.price_list && <Route
                    exact
                    path='/dashboard/adminpricelist'
                    render={() => <AdminPriceList
                        countries={props.countries}
                        bmTypes={props.bmTypes}
                        user={props.user}
                    />}
                />}
                {props.user.admin && props.user.permission.price_list_update && <Route
                    exact
                    path='/dashboard/adminpricelist/addcountry'
                    render={() => <AdminAddCountry
                        countryCreateOrUpdate={props.countryCreateOrUpdate}
                        getUserData={props.getUserData}
                        setUserState={props.setUserState}
                    />}
                />}
                {props.user.admin && props.user.permission.price_list_update && <Route
                    path='/dashboard/adminpricelist/addcountry/:country'
                    render={(url) => <AdminAddCountry
                        countries={props.countries.find(country => (country.id.toString() === url.match.params.country))}
                        countryCreateOrUpdate={props.countryCreateOrUpdate}
                        getUserData={props.getUserData}
                        setUserState={props.setUserState}
                    />}
                />}
                {props.user.admin && props.user.permission.price_list_update && <Route
                    exact
                    path='/dashboard/adminpricelist/addbmtype'
                    render={() => <AdminAddBmType
                        bmTypeCreateOrUpdate={props.bmTypeCreateOrUpdate}
                        getUserData={props.getUserData}
                        setUserState={props.setUserState}
                    />}
                />}
                {props.user.admin && props.user.permission.price_list_update && <Route
                    path='/dashboard/adminpricelist/addbmtype/:bmtype'
                    render={(url) => <AdminAddBmType
                        bmType={props.bmTypes.find(bmType => (bmType.id.toString() === url.match.params.bmtype))}
                        bmTypeCreateOrUpdate={props.bmTypeCreateOrUpdate}
                        getUserData={props.getUserData}
                        setUserState={props.setUserState}
                    />}
                />}
                      {props.user.admin && props.user.permission.price_list_update && <Route
                    path='/dashboard/adminpricelist/addrequisites'
                    render={(url) => <AddReq
                        // countries={props.countries.find(country => (country.id.toString() === url.match.params.country))}
                        // countryCreateOrUpdate={props.countryCreateOrUpdate}
                        // getUserData={props.getUserData}
                        // setUserState={props.setUserState}
                    />}
                />}
                <Route
                    exact
                    path='/dashboard/faq'
                    render={() => <Faq
                        faqs={props.faqs}
                        user={props.user}
                    />}
                />
                {props.user.admin && props.user.permission.faq_update && <Route
                    exact
                    path='/dashboard/faq/create-faq'
                    render={() => <AdminCreateFAQ
                        faqCreateOrUpdate={props.faqCreateOrUpdate}
                        getUserData={props.getUserData}
                        setUserState={props.setUserState}
                        user={props.user}
                    />}
                />}
                {props.user.admin && props.user.permission.faq_update && <Route
                    path='/dashboard/faq/create-faq/:faq'
                    render={(url) => <AdminCreateFAQ
                        faq={props.faqs.find(faq => (faq.id.toString() === url.match.params.faq))}
                        faqCreateOrUpdate={props.faqCreateOrUpdate}
                        getUserData={props.getUserData}
                        setUserState={props.setUserState}
                        faqDelete={props.faqDelete}
                        user={props.user}
                    />}
                />}
                <Route
                    path="/dashboard/settings"
                    render={() => <Settings
                        user={props.user}
                        getUserData={props.getUserData}
                        setUserState={props.setUserState}
                        ru={props.user.ru}
                        auth={props.user.auth}
                        telMessages={props.user.telMessages}
                        patchUserData={props.patchUserData}
                    />}
                />
                {props.user.admin && props.user.permission.log && <Route
                    path="/dashboard/log"
                    render={() => <AdminLog
                        dashboard={props.dashboard}
                        logList={props.logList}
                        getUserData={props.getUserData}
                        setUserState={props.setUserState}
                        skip={props.skip}
                        user={props.user}
                    />}
                />}
                <Route
                    exact
                    path="/dashboard/tickets"
                    render={() => <Tickets
                        ticketTypes={props.ticketTypes}
                        tickets={props.tickets}
                        getTickets={props.getTickets}
                        admin={true}
                        user={props.user}
                    />}
                />
                <Route
                    path="/dashboard/tickets/ticket/:id"
                    render={(url) => <TicketChat
                        ticketCreateOrUpdate={props.ticketCreateOrUpdate}
                        ticket={props.tickets?.find(ticket => (ticket.id.toString() === url.match.params.id))}
                        admin={true}
                        getTickets={props.getTickets}
                        messageCreate={props.messageCreate}
                        user={props.user}
                        setUserState={props.setUserState}
                    />}
                />
                <Route
                    exact
                    path="/dashboard/tickets/create-ticket"
                    render={() => <CreateTicket
                        ticketTypes={props.ticketTypes}
                        admin={true}
                        ticketCreateOrUpdate={props.ticketCreateOrUpdate}
                        getTickets={props.getTickets}
                    />}
                />
                <Route
                    exact
                    path="/dashboard/tickets/ticket-types"
                    render={() => <AdminTicketTypes
                        ticketTypes={props.ticketTypes}
                        getTickets={props.getTickets}
                    />}
                />
                <Route
                    exact
                    path="/dashboard/tickets/ticket-types/type"
                    render={() => <AdminEditTicketType
                        ticketTypeCreateOrUpdate={props.ticketTypeCreateOrUpdate}
                        getTickets={props.getTickets}
                    />}
                />
                <Route
                    path="/dashboard/tickets/ticket-types/type/:id"
                    render={(url) => <AdminEditTicketType
                        ticketType={props.ticketTypes?.find(type => (type.id.toString() === url.match.params.id))}
                        ticketTypeCreateOrUpdate={props.ticketTypeCreateOrUpdate}
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

export default AdminMain;