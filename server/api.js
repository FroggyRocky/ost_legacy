const express = require('express'),
    router = express.Router();
    require('dotenv').config();

const data = require('./controllers/data'),
    facebook = require('./controllers/facebook'),
    buy = require('./controllers/buy'),
    faq = require('./controllers/faq'),
    authentication = require('./controllers/authentication'),
    account = require('./controllers/account'),
    user = require('./controllers/user'),
    bm = require('./controllers/bm'),
    country = require('./controllers/country'),
    accountAndBm = require('./controllers/accountAndBm'),
    other = require('./controllers/other'),
    ticket = require('./controllers/ticket');

// Data
router.post('/data', authentication.token, data.data);

// Account
router.post('/account', authentication.token, account.account);
router.post('/user-account', authentication.token, account.userAccount);
router.post('/accounts', authentication.token, account.accounts);
router.post('/uuid', authentication.token, account.uuid);
router.post('/multi-accounts', authentication.token, account.multiAccounts);
router.post('/multi-token', authentication.token, account.multiToken);
router.post('/proxy-traffic', authentication.token, account.proxyTraffic);
router.post('/proxy-data', authentication.token, account.proxyData);
router.post('/add-proxy-traffic', authentication.token, account.addProxyTraffic);

// BM
router.post('/bm', authentication.token, bm.bm);
router.post('/user-bm', authentication.token, bm.userBm);
router.post('/bm-type', authentication.token, bm.bmType);
router.post('/bms', authentication.token, bm.bms);

// Account and BM
router.post('/problem', authentication.token, accountAndBm.problem);
router.post('/bm-to-acc', authentication.token, accountAndBm.bmToAcc);
router.post('/skip', authentication.token, accountAndBm.skip);

// Buy
router.post('/buy', authentication.token, buy.buy);

// Facebook
router.get('/ip', facebook.ip);
router.post('/statistics', authentication.token, facebook.statistics);
router.get('/test', facebook.test);
router.post('/check-bm', facebook.checkBM);
router.post('/fa', facebook.fa);
router.post('/token', facebook.token);

// User
router.post('/admin-user', authentication.token, user.adminUser);
router.post('/user', authentication.token, user.user);
router.get('/add-admin', user.addAdmin);

// FAQs
router.post('/faqs', authentication.token, faq.faqPost);
router.post('/faq-delete', authentication.token, faq.faqDelete);

// Authentication
router.post('/reset', authentication.reset);
router.post('/login', authentication.login);
router.post('/forget', authentication.forget);
router.post ('/registration', authentication.registration);
router.post ('/approve', authentication.token, authentication.approve);
router.post('/email', authentication.confirmEmail);

// Country
router.post('/country', authentication.token, country.country);

// Other
router.post('/get-phones', authentication.token, other.getPhones);
router.post('/set-phone', other.setPhone);
router.post('/admin-phone', authentication.token, other.adminPhone);
router.post('/admin-phone-delete', authentication.token, other.adminPhoneDelete);

//Ticket
router.post('/ticket', authentication.token, ticket.ticket);
router.post('/ticket-type', authentication.token, ticket.ticketType);
router.post('/tickets', authentication.token, ticket.tickets);
router.post('/message', authentication.token, ticket.message);
router.post('/get-creator-email', authentication.token, ticket.ticketCreatorId)
router.post('/create-balance-message',authentication.token, ticket.balanceMessage);
router.post('/ticket-balance-type-id',authentication.token, ticket.ticketBalanceTypeId)
module.exports = router;