import axios from "axios";
import {serverURL} from './URL'

async function getUserData(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return await axios.post(`${serverURL}/data`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}


async function buyAccount(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return await axios.post(`${serverURL}/buy`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}

async function patchUserData(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/user`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}

async function archiveUserAccount(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/user-account`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}

async function archiveUserBM(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/user-bm`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}

async function iHaveAProblem(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/problem`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}

async function bindBmToAcc(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/bm-to-acc`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}

async function getStatistics(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/statistics`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}

async function proxyTraffic(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/proxy-traffic`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}

async function addProxyTraffic(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/add-proxy-traffic`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}

async function checkBmLimit(data) {
    return axios.post(`${serverURL}/check-bm`,
        {id: data}
    )
}

async function getUserEmailById(data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return await axios.post(`${serverURL}/get-creator-email`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}


async function uploadS3File(file) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    const fd = new FormData()
    fd.append('file', file)
    return await axios.post(`${serverURL}/upload-s3-file`, fd,
        {
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'multipart/form-data'
            }
        }
    )
}

async function getReferralData() {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return await axios.get(`${serverURL}/get-referral-data`, {headers: {Authorization: 'Bearer ' + token}})
}

async function getInvitedEmails() {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return await axios.get(`${serverURL}/get-invited-emails`, {headers: {Authorization: 'Bearer ' + token}})
}


async function readMessages(userId, ticketId) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return await axios.post(`${serverURL}/read-messages`, {
        userId,
        ticketId
    }, {headers: {Authorization: 'Bearer ' + token}})
}

async function fetchUSDTTRC_20(walletRequisites, minTimeStamp, maxTimeStamp) {
    const {data} = await axios.get(`https://api.trongrid.io/v1/accounts/${walletRequisites}/transactions/trc20?only_to=true&limit=200&min_timestamp=${minTimeStamp}&max_timestamp=${maxTimeStamp}`)
    return data
}
async function topUp(sum, ticketCreatorId, transaction_id) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return await axios.post(`${serverURL}/top-up`, {sum,ticketCreatorId, transaction_id}, {headers: {Authorization: 'Bearer ' + token}})
}
async function solveTicket(ticketId, ticketCreatorId, transaction_id) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return await axios.post(`${serverURL}/solve-ticket`, {ticketId, ticketCreatorId, transaction_id}, {headers: {Authorization: 'Bearer ' + token}})
}
const userApi = {
    getUserData,
    patchUserData,
    archiveUserAccount,
    buyAccount,
    archiveUserBM,
    iHaveAProblem,
    bindBmToAcc,
    getStatistics,
    proxyTraffic,
    addProxyTraffic,
    checkBmLimit,
    getUserEmailById,
    uploadS3File,
    getReferralData,
    getInvitedEmails,
    readMessages,
    fetchUSDTTRC_20,
    topUp,
    solveTicket
};

export default userApi;