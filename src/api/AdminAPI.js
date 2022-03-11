import axios from "axios";
import {serverURL} from './URL';

async function faqCreateOrUpdate(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/faqs`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}
async function faqDelete(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/faq-delete`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}
async function adminUserUpdate(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/admin-user`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}
async function countryCreateOrUpdate(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/country`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}
async function bmTypeCreateOrUpdate(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/bm-type`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}
async function accCreateOrUpdate(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/account`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}
async function bmCreateOrUpdate(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/bm`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}
async function approveUser(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/approve`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}
async function accBulkCreate(data) { 
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/accounts`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}
async function accountUUID(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/uuid`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}
async function bmBulkCreate(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/bms`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}
async function proxyData(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/proxy-data`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}
async function ticketTypeCreateOrUpdate(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/ticket-type`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}

async function getBalanceTicketTypeId(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/ticket-balance-type-id`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}

async function getTickets(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/tickets`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}
async function ticketCreateOrUpdate(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/ticket`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}

async function messageCreate(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/message`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}
async function setBalanceAutoMessage(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/create-balance-message`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}
async function skip(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/skip`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}

const adminApi = {faqCreateOrUpdate, adminUserUpdate, countryCreateOrUpdate, accCreateOrUpdate, faqDelete,
    bmTypeCreateOrUpdate, bmCreateOrUpdate, approveUser, accBulkCreate, bmBulkCreate, accountUUID, proxyData,
    ticketTypeCreateOrUpdate, getBalanceTicketTypeId, getTickets, ticketCreateOrUpdate, messageCreate,setBalanceAutoMessage, skip
};

export default adminApi;