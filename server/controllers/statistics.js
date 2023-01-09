const modules = require('../dbmodels')
const axios = require('axios')
const request = require('request')
const fs = require('fs')
const redis = require('../redisConnection')

function handleRawCookies(cookies) {
    let cookie_string = ''
    for (let i = 0; i < cookies.length; i++) {
        if (cookies[i]['domain'].match(/facebook|fb/)) {
            const name = cookies[i]['name']
            const value = cookies[i]['value']
            cookie_string += `${name}=${value};`
            cookie_string = cookie_string.trim().trim(';')
        }
    }
    return cookie_string
}

async function getRedisAccessTokes(accountId) {
    const accessToken = redis.get(`${accountId}`)
    return accessToken
}

async function getActId(cookies) {
    const reg = /(act=[\w\d]+)/g
    try {
        var config = {
            method: 'get',
            url: 'https://www.facebook.com/adsmanager/manage/campaigns',

            headers: {
                'Cookie': cookies,
                proxy: {
                    host: 'http://3DWcUE:K4esoE@186.65.117.208',
                    port: '9896'
                }
            }
        };

        const response = await axios(config)
        const found = response.data.match(reg)
        const act_id = found[0].split('=')[1]
        return act_id

    } catch (e) {
        console.log(e)
    }
}

async function getAccessToken(act_id, cookies, proxyData) {
    const reg = /(EAAB[\w\d]+)/
    var config = {
        method: 'get',
        url: `https://www.facebook.com/adsmanager/manage/accounts?act=${act_id}&nav_source=no_referrer`,
        headers: {
            'Cookie': cookies,
            proxy: {
                host: `http://${proxyData.proxy_login}:${proxyData.proxy_password}@${proxyData.proxy_ip}`,
            }
        }
    };
    const response = await axios(config)
    const found = response.data.match(reg)
    const access_token = found[1]
    return access_token
}

exports.statistics = async (req, res) => {
    try {
        if (!req.admin || (req.admin && req.permission.statistics)) {
            const accountId = req.body.data
            const account = await modules.Accounts.findByPk(accountId, {
                raw: true,
                attributes: ['userId', 'proxy_ip', 'proxy_login', 'proxy_password', 'act_id', 'cookies']
            });

            if (!account.cookies || account.proxy_ip === '' || !account.proxy_ip || account.proxy_login === '' || !account.proxy_login || account.proxy_password === '' || !account.proxy_password) {
                res.send({error: {message: 'Check all proxy whether cookie fields are filled'}})
            } else {
                let actId;
                const handledCookies = handleRawCookies(JSON.parse(account.cookies))
                const proxyData = {
                    proxy_ip: account.proxy_ip,
                    proxy_login: account.proxy_login,
                    proxy_password: account.proxy_password
                }
                if (!account.act_id) {
                    actId = await getActId(handledCookies)
                    await modules.Accounts.update(
                        {act_id: actId},
                        {where: {id: accountId}}
                    )
                } else {
                    actId = account.act_id
                }
                let accessToken;
                const redisToken = await getRedisAccessTokes(accountId)
                const dbToken = await modules.Accounts.findOne({where: {id: accountId}})
                if (!redisToken || !dbToken.token) {
                    accessToken = await getAccessToken(actId, handledCookies, proxyData);
                    await redis.set(accountId, accessToken)
                    await redis.expire(accountId, Math.round(24 * 60 * 60))
                    await modules.Accounts.update({token: accessToken}, {where: {id: accountId}})
                } else {
                    accessToken = redisToken;
                }
                var config = {
                    method: 'get',
                    url: `https://graph.facebook.com/v7.0/me/adaccounts`,
                    params: {
                        fields: 'business{name},name,account_id,account_status,disable_reason,campaigns{daily_budget,lifetime_budget,adset_budgets,adsets{start_time,status,targeting,adcreatives{link_url,status,thumbnail_url,object_story_spec{link_data{link}}},insights.date_preset(lifetime){relevance_score,inline_link_click_ctr,inline_link_clicks,cpm,spend}}}',
                        access_token: accessToken
                    },
                    headers: {
                        'Cookie': handledCookies,
                        proxy: {
                            host: `http://${proxyData.proxy_login}:${proxyData.proxy_password}@${proxyData.proxy_ip}`,
                        }
                    }
                }
                const response = await axios(config)
                res.send(response.data.data)
            }
        } else {
            res.send({error: {message: 'It is not your account'}})
        }
    } catch (e) {
        console.log(e)
        if(e.response.statusText) {
            res.send({error: {message: 'Something went wrong, ' + e.response.statusText}})
        } else {
            res.send({error: {message: 'Something went wrong, unknown error'}})
        }
    }
}