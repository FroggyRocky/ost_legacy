const modules = require('../dbmodels'),
    request = require('request'),
    speakeasy = require('speakeasy'),
    axios = require('axios');

exports.ip = async (req, res) => {
    console.log(req.ip);
    res.send(req.ip);
};
exports.fa = (req, res) => {
    console.log(req.headers.referer);
    console.log(req.body);
    if (req.headers.referer === 'https://afffind.com/fa.html' || req.headers.referer === 'https://afffind.com/' || req.headers.referer === 'https://afffind.com/fa') {
        try {
            const time = Math.round(new Date() / 1000);
            const delta = 29 - time % 30;
            const code = speakeasy.totp({secret: req.body.id, encoding: 'base32', time: time});
            res.send({code: code, left: delta});
        } catch (e) {
            console.log(e);
            res.send('error')
        }
    } else {
        res.sendStatus(401)
    }
};
exports.token = async (req, res) => {
    console.log(req.body);
    console.log(req.headers.referer);
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
    };
    const disable_reasons = ['NONE', 'ADS_INTEGRITY_POLICY', 'ADS_IP_REVIEW', 'RISK_PAYMENT', 'GRAY_ACCOUNT_SHUT_DOWN', 'ADS_AFC_REVIEW', 'BUSINESS_INTEGRITY_RAR', 'PERMANENT_CLOSE', 'UNUSED_RESELLER_ACCOUNT', 'UNUSED_ACCOUNT'];
    try {
    request.get(`https://graph.facebook.com/v7.0/me/adaccounts`,
        {
            qs: {
                /*fields: 'business{name},name,account_status,disable_reason,campaigns{status,configured_status,effective_status,adsets{status,configured_status,effective_status,adcreatives{link_url,status,thumbnail_url,object_story_spec{link_data{link}}}}}',*/
                fields: 'business{name},name,account_status,disable_reason,ads{ad_review_feedback,name,effective_status,adcreatives{thumbnail_url}}',
                /*fields: 'adspixels,promote_pages{access_token,id},insights.date_preset(lifetime),ads.date_preset(lifetime).time_increment(lifetime).limit(500){insights.limit(500).date_preset(lifetime){results,relevance_score,inline_link_click_ctr,inline_link_clicks,ctr,cpc,cpm},creative{effective_object_story_id,effective_instagram_story_id,actor_id},adlabels,created_time,recommendations,updated_time,ad_review_feedback,bid_info,configured_status,delivery_info,status,effective_status,adcreatives.limit(500){place_page_set_id,object_story_spec{instagram_actor_id,link_data{link},page_id},image_crops,image_url,status,thumbnail_url},result,cost_per_lead_fb,name,clicks,spent,cost_per,reach,link_ctr,impressions},funding_source_details,business{name,link},adrules_library{name},current_unbilled_spend,adspaymentcycle,spend_cap,amount_spent,age,disable_reason,account_status,balance,all_payment_methods{pm_credit_card{account_id,credential_id,display_string,exp_month,exp_year}},currency,timezone_name,created_time,name,status,adtrust_dsl',*/
                access_token: req.body.id
            }
        }, function (error, response, body) {
            if (error) {
                console.log(error);
                res.send({error: {message: error}})
            } else {
                try {
                    body = JSON.parse(body);
                    if (body.error) {
                        res.send({error: body.error.message});
                    } else {
                        const info = [];
                        body.data.forEach(el => {
                            if (el.ads) {
                                el.ads.data.forEach(item => {
                                    info.push({
                                        name: el.name,
                                        status: account_statuses[el.account_status],
                                        reason: disable_reasons[el.disable_reason],
                                        img: item.adcreatives.data[0].thumbnail_url,
                                        ad_status: item.effective_status,
                                        ad_name: item.name,
                                        ad_review: item.ad_review_feedback ? item.ad_review_feedback.global : ''
                                    });
                                })
                            }
                        });
                        res.send(info);
                    }
                } catch (e) {
                    res.send(e);
                }
            }
        });
    } catch (e) {
        console.log(e);
        res.send(e)
    }
};
exports.checkBM = async (req, res) => {
    console.log(req.body);
    console.log(req.headers.referer);
    if (req.headers.referer === 'https://afffind.com/' || req.headers.referer === 'https://afffind.com/index.html' || req.headers.referer === 'http://localhost:3000/'|| req.headers.referer === 'https://grebi-money.ru/dashboard/check-bm') {
        const token = 'EAABsbCS1iHgBAFrcecYeUQo3oRq5RDfgq9AqvotBEXzAG3q6bJ3xDOSzIWtDtk53PXfYJwgmfCs39N3TBnbUqesKPmfBkvWsAKIVer82GsksRCjRnZBOTFGTZCL30Tp04c7mLD8oSKSAa2cQFsugw6Lo9Obh46SPQnuZCtQYoel6ZCDGwNPuAYMqepBLKBkZD';
        try {
            const result = await axios.get(`https://graph.facebook.com/v9.0/${req.body.id}?access_token=${token}&_index=0&_reqName=object:brand&_reqSrc=BrandResourceRequests.brands&date_format=U&fields=["id","name","vertical_id","timezone_id","picture.type(square)","primary_page.fields(name,%20picture,%20link)","payment_account_id","link","created_time","created_by.fields(name)","updated_time","updated_by.fields(name)","extended_updated_time","two_factor_type","allow_page_management_in_www","eligible_app_id_for_ami_initiation","verification_status","sharing_eligibility_status","can_create_ad_account","is_business_verification_eligible","is_non_discrimination_certified"]&locale=es_LA&method=get&pretty=0&suppress_http_code=1`);
            if (result.data.allow_page_management_in_www === true || result.data.allow_page_management_in_www === false) {
                res.send({
                    active: result.data.allow_page_management_in_www === true ? 1 : 0,
                    limit: result.data.sharing_eligibility_status === 'enabled' ? 1 : 0,
                });
            } else {
                res.send('error');
            }
        } catch (e) {
            res.send('error');
        }
    } else {
        res.sendStatus(401)
    }
};
exports.statistics = async (req, res) => {
    if (!req.admin || (req.admin && req.permission.statistics)) {
        try {
            const account = await modules.Accounts.findByPk(req.body.data, {
                attributes: ['userId', 'token', 'proxy_ip', 'proxy_login', 'proxy_password']
            });
            if (req.id === account.userId || (req.admin && req.permission.statistics)) {
                if (account.token === '' || !account.token) {
                    res.send({error: {message: 'There is no access token for this account'}})
                } else if (account.proxy_ip === '' || !account.proxy_ip || account.proxy_login === '' || !account.proxy_login || account.proxy_password === '' || !account.proxy_password) {
                    res.send({error: {message: 'Check all proxy fields, one or more is empty'}})
                } else {
                    request.get(`https://graph.facebook.com/v7.0/me/adaccounts`,
                        {
                            qs: {
                                fields: 'business{name},name,account_id,account_status,disable_reason,campaigns{daily_budget,lifetime_budget,adset_budgets,adsets{start_time,status,targeting,adcreatives{link_url,status,thumbnail_url,object_story_spec{link_data{link}}},insights.date_preset(lifetime){relevance_score,inline_link_click_ctr,inline_link_clicks,cpm,spend}}}',
                                access_token: account.token
                            },
                            proxy: `http://${account.proxy_login}:${account.proxy_password}@${account.proxy_ip}`
                        }, function (error, response, body) {
                            if (error) {
                                console.log(error);
                                res.send({error: {message: error}})
                            } else {
                                if (response.statusCode === 407) res.send({error: {message: 'Плохое прокси'}});
                                if (response.statusCode === 200) {
                                    /*console.dir(JSON.parse(body), {depth: null, colors: true});*/
                                    /*console.log(JSON.parse(body.data));*/
                                    /*res.sendStatus(200);*/
                                    res.send(body);
                                } else {
                                    res.send(body);
                                }
                            }
                            /*console.log(response);*/
                        });
                }
            } else {
                res.send({error: {message: 'It is not your account'}})
            }
        } catch (e) {
            res.send(e)
        }
    } else {
        res.sendStatus(401)
    }
};

exports.test = async (req, res) => {
    try {
        res.send('test');
        /*/!*const loginData = {
            email: encodeURI('79692185054'),
            password: encodeURI('Ca71b5Aie7us4'),
            login: 'Login'
        };
        let formData = new FormData();
        for (let key in loginData) {
            formData.append(key, loginData[key])
        }*!/
        const data = await axios.post(`https://m.facebook.com/login.php`,
            /!*const data = await axios.post(`http://350044-cq02541.tmweb.ru:3000/api/ip`,*!/
            {
                formData: {
                    email: encodeURI('79692185054'),
                    password: encodeURI('Ca71b5Aie7us4'),
                    login: 'Login'
                }
            },
            {
                proxy: {
                    host: '196.17.169.52',
                    port: 8000,
                    auth: {username: '5Pkozh', password: 'mnG2zS'}
                },
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
                }
            });*/
        /*const loginData = {
            access_token: '438142079694454|fc0a7caa49b192f64f6f5a6d9643bb28',
            email: '79692185054',
            format: 'json',
            generate_session_cookies: '1',
            locale: 'ru_RU',
            password: 'Ca71b5Aie7us4'
        };
        let formData = new FormData();
        for (let key in loginData) {
            formData.append(key, loginData[key])
        }*/
        /*const data = await axios.post(`https://graph.facebook.com/v8.0/auth/login/`,
            null,
            {params: {
                    access_token: encodeURI('438142079694454|fc0a7caa49b192f64f6f5a6d9643bb28'),
                    email: encodeURI('79692181317'),
                    password: encodeURI('Sel47EMiYo')
                },
                proxy: {
                    host: '193.228.49.78',
                    port: 8000,
                    auth: {username: 'w7c08m', password: 'X9QLUz'}
                },
            });*/
        /*let agent = new httpsProxyAgent(
            'http://AL86zg:XpypGR@196.18.13.226:8000'*/
        /*host: "196.18.13.226",
        port: "8000",
        auth: "AL86zg:XpypGR"*/
        /*);*/
        /*const data = await axios.get(`https://graph.facebook.com/v8.0/me?fields=id&access_token=EAAZAYl2lgZBRABAJSqeM2FqVHkl7ZCxeAgHoRdt3RYH4nfFQHdjJxZBD6ORd5XbdBjdFm3E1hCIRnMja5fllSIohygfnlDfDnHXIUSOvs1nY3ZAcBKqnMY5Cz7nsvi8pLEdI9y5JUZATX4w6cwzQ7x84CpuMqfMwd4xwTIeZCDWMK1t1fRxzjyLLbBJKKo23xcZD`,*/
        /*const data = await axios.get(`http://350044-cq02541.tmweb.ru:3000/api/ip`,*/
        /*const data = await axios.get(`https://postman-echo.com/get?foo1=bar1&foo2=bar2`,*/
        /*const data = await axios.get(`https://postman-echo.com/get?foo1=bar1&foo2=bar2`,*/
        /*{
                httpsAgent: agent,*/
        /*params: {
            fields: encodeURI('adaccounts'),
            access_token: encodeURI('EAAFKGLpGe1QBABOjLIPksZAAHUZAUSqiYubL7zvsJOZAdIWM7Vj7foBefolDtKboJZBi2h1B9GjBKghmuszqLrbX3C1BFApg2AcdlipFoD8QrKgon8MzXc9w1hqVPHZB4Id0mZAWblY7AJ7RXVaS1wpP16HoX2CZAb9EFZAtZB5TRYKyVTNi0glSCtezvIecjBJlwEZBOKDqLjknp87vxwoiRu'),
        },*/
        /*proxy: {
            host: '196.18.13.226',
            port: 8000,
            auth: {username: 'AL86zg', password: 'XpypGR'}
        },*/
        /*headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:81.0) Gecko/20100101 Firefox/81.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*!/!*;q=0.8'
        }*/
        /*});*/
        /*console.log(data);*/
        /*request.get(`https://graph.facebook.com/v8.0/me/accounts`,
        /!*request.get(`https://graph.facebook.com/v8.0/me/accounts?access_token=EAABsbCS1iHgBAAGpzZAbNtggVOVGsK5f2oyIFw1nbGlyreZCACmJOnfvKKGKohtutxmSJdYnbC5QovoegMhrx7AvicgFIf8XnpVzpEfFdM7hh0bkqooAyB9DToB0Oj94rDK23C44WJZBieBe8MeynYU1v4V1R1DXYepDqM5bO9JA3xwePdt`,*!/
        /!*request.get(`http://350044-cq02541.tmweb.ru:3000/api/ip`,*!/
            {
                qs: {
                    access_token: 'EAABsbCS1iHgBAAGpzZAbNtggVOVGsK5f2oyIFw1nbGlyreZCACmJOnfvKKGKohtutxmSJdYnbC5QovoegMhrx7AvicgFIf8XnpVzpEfFdM7hh0bkqooAyB9DToB0Oj94rDK23C44WJZBieBe8MeynYU1v4V1R1DXYepDqM5bO9JA3xwePdt'
                },
                proxy: 'http://AL86zg:XpypGR@196.18.13.226:8000'
            }, function (error, response, body) {
                if (response.statusCode === 407) res.send('Плохое прокси');
                if (response.statusCode === 200) res.send(body);
            });
            Sara:
            access_token: 'EAABsbCS1iHgBAFzcudQyUHJ0j7hYGu5fjjjMISVIvgwFLhlywCv4ygUiLbIp5KVFb9iKSOEnPBlXdvPKBUZAUS3r3kJ3OF55RqcGxpuwhWTlc6Ki9x0YfrblmrIZBTi7689XK0mW64L75WYtZAftDnh8ZCwADvQmIMZAEe3RFhuBGaLEAykNpjU3SQBfXNM0ZD'
            proxy: 'http://RfUNb9:8nh4KV@196.18.2.48:8000'

            Frank Hofmann:
             access_token: 'EAABsbCS1iHgBAMUQwyEf7u0BbyuRG5iZA05R8mu5PaTQlKl1MWzc6TZBEmJZBZBv1iw4dFIjwNgmGVD46OW82RdW45HB9kSCEf7Al07EzrFFfILOqBjkAZBiZCjDpVHwqa0l8igQnLjTg2pgx9mLhfDlX5h592VKGOpZAAXPsTB4s6r01eoLyMm839yFpQfgKkZD'
                },
                proxy: 'http://RfUNb9:8nh4KV@196.18.3.246:8000'

            Ingo Mausolf:
                access_token: 'EAABsbCS1iHgBAK8gSEjWgRQ18y7YM8BlSVdaBsiYNCi9UZCFhhruhdrWgO2BOejPOFJdLCQLoU7wxGBevnoLjJ2kBZCjrsLMhbAwtaX6wkZCCMErmVA7zbn16pANm8SHHw0Rf4I6fK5aOniQwKzPkZAMLgm5511qty7rRjodLEt9qwrHQ2ZAuy8v9bvYOZBUEZD'
                },
                proxy: 'http://RfUNb9:8nh4KV@196.18.2.107:8000'

            */
        /*request.get(`https://graph.facebook.com/v7.0/me/adaccounts`,
            {
                qs: {
                    fields: 'business{name},name,account_id,account_status,disable_reason,campaigns{daily_budget,lifetime_budget,adset_budgets,adsets{start_time,status,targeting,adcreatives{link_url,status,thumbnail_url,object_story_spec{link_data{link}}},insights.date_preset(lifetime){relevance_score,inline_link_click_ctr,inline_link_clicks,cpm,spend}}}',
                    access_token: 'EAABsbCS1iHgBAJsN3fHRAZCudp2dahZAWrDv7kCA7mxZCAkwv5ClzpM5hmnDoepgkIDRGSl2NCxle95HZAAnZARTndGsQdAZC9EvOkpM4NEHdoecnTWF0hbYFdR2a7pSCHGPcTUH7l4nS2JbaK1cZArAJb63sq1FUe4JYy07UspbaNTQWGfaOOY3wX3sdVC3gcZD'
                },
                proxy: 'http://gdQVwG:8X78Zb@196.16.244.32:8000'
            }, function (error, response, body) {
                /!*console.log(response);*!/
                if (response.statusCode === 407) res.send('Плохое прокси');
                /!*console.log(response.body);*!/
                if (response.statusCode === 200) {
                    /!*console.dir(JSON.parse(body), {depth: null, colors: true});*!/
                    res.send(`<pre>${JSON.stringify(JSON.parse(response.body), null, 4)}</pre>`);
                } else {
                    res.send(body);
                }
            });*/
    } catch (e) {
        console.log(e)
    }
};