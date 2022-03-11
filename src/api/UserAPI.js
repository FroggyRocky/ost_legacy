import axios from "axios";
import {serverURL} from './URL'

async function getUserData (data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return await axios.post(`${serverURL}/data`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
        )
}


async function buyAccount (data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return await axios.post(`${serverURL}/buy`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}

async function patchUserData (data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/user`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}

async function archiveUserAccount (data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/user-account`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}
async function archiveUserBM (data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/user-bm`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}
async function iHaveAProblem (data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/problem`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}
async function bindBmToAcc (data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/bm-to-acc`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}
async function getStatistics (data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/statistics`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}
async function proxyTraffic (data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/proxy-traffic`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}
async function addProxyTraffic (data) {
    let token = localStorage.getItem('token');
    if (!token) token = sessionStorage.getItem('token');
    return axios.post(`${serverURL}/add-proxy-traffic`,
        {data},
        {headers: {Authorization: 'Bearer ' + token}}
    )
}
async function checkBmLimit (data) {
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
    getUserEmailById
};

export default userApi;