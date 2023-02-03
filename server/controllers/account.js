const {rename} = require('fs');
const modules = require('../dbmodels'),
    sequelize = require('sequelize'),
    {Op} = require('sequelize'),
    axios = require('axios');
require('dotenv').config();


async function getProxy6(id) {
    const result = await axios.get(`https://proxy6.net/api/${process.env.PROXY6_TOKEN}/getproxy?state=active&nokey`)
    const list = result.data.list
    return list.find(el => el.id === id)
}


exports.account = async (req, res) => {
    if (req.permission.acc_bm_update) {
        try {

            const data = {
                statusId: req.body.data.statusId,
                countryId: req.body.data.countryId,
                login: req.body.data.login,
                password: req.body.data.password,
                email: req.body.data.email,
                email_password: req.body.data.email_password,
                type: req.body.data.type || 'standard',
                code2fa: req.body.data.code2fa || null,
                agent: req.body.data.agent || null,
                resolution: req.body.data.resolution || null,
                language: req.body.data.language || null,
                platform: req.body.data.platform || null,
                concurrency: req.body.data.concurrency || null,
                proxy: req.body.data.proxy || 'HTTP',
                proxy_id: req.body.data.proxy_id || null,
                proxy_ip: req.body.data.proxy_ip || null,
                proxy_login: req.body.data.proxy_login || null,
                proxy_password: req.body.data.proxy_password || null,
                userId: req.body.data.userId || null,
                selfie: req.body.data.selfie || null,
                token: req.body.data.token,
                archived: req.body.data.archived || false,
                cookies: req.body.data.cookies || null,
                birth: req.body.data.birth
            };
            if (req.body.data.id) {
                const currentAcc = await modules.Accounts.findByPk(req.body.data.id, {
                    attributes: ['userId', 'creator']
                });
                if (req.permission.acc_bm === 2 || (req.permission.acc_bm === 1 && currentAcc.creator === req.id)) {
                    if (req.body.data.changeAccount) {
                        const account = await modules.Accounts.findByPk(req.body.data.changeAccount);
                        if (currentAcc.creator !== req.id && req.permission.acc_bm === 1) return res.send('You must be a creator of both accounts');
                        if (!account) return res.send('Account not found');
                        if (!account.userId) return res.send('Replaced account must have an owner ');
                        if (account.id === req.body.data.id) return res.send('You can&#39t replace an account to the same');
                        if (data.userId) return res.send('This account has already an owner');
                        if (account.statusId !== 3) return res.send('Client&#39s account must have a problem');
                        if (data.statusId === 3) return res.send('This account must not have a problem ');
                        if (!data.userId && account.statusId === 3 && data.statusId !== 3 && account.userId) {
                            await modules.Accounts.update({bmId: null, archived: true}, {
                                where: {
                                    id: req.body.data.changeAccount
                                }
                            });
                            if (account.bmId) {
                                data.bmId = account.bmId;
                                data.userId = account.userId;
                                data.statusId = 4;
                            }
                            data.bought = sequelize.fn('NOW');
                            await modules.Log.create({
                                owner: req.id,
                                receiver: account.userId,
                                operation: 3,
                                description: `Account ${req.body.data.changeAccount} was replaced to ${req.body.data.id}`,
                            });
                        } else {
                            return res.send('Something is wrong, replacement failed');
                        }
                    }
                    if (data.userId !== currentAcc.userId) {
                        let receiver,
                            text;
                        if (data.userId) {
                            receiver = data.userId;
                            text = 'added to the user';
                            data.bought = sequelize.fn('NOW');
                        } else {
                            receiver = currentAcc.userId;
                            text = 'deleted from the user - ';
                        }
                        await modules.Log.create({
                            owner: req.id,
                            receiver: receiver,
                            operation: 4,
                            description: `Account ${req.body.data.id} was ${text} ${receiver}`,
                        });
                    }
                    if (data.proxy_id) {
                        try {
                            const result = await axios.get(`https://astroproxy.com/api/v1/ports/${req.body.data.proxy_id}?token=${process.env.PROXY_TOKEN}`);
                            const {node, access, ports} = result.data.data
                            const ip = node.ip + ':' + ports.http
                            data.proxy_ip = ip;
                            data.proxy_login = access.login
                            data.proxy_password = access.password
                        } catch (e) {
                            console.log(e)
                        }
                    } else if (!data.proxy_id && data.proxy_ip) {
                        const result = await axios.get(`http://${data.proxy_ip}/api/info?apiToken=${process.env.PROXY_TOKEN}`)
                        const id = result.data.proxy_id
                        const result2 = await axios.get(`https://astroproxy.com/api/v1/ports/${id}?token=${process.env.PROXY_TOKEN}`);
                        const {node, access, ports} = result2.data.data
                        data.proxy_ip = node.ip + ':' + ports.http;
                        data.proxy_id = id
                        data.proxy_login = access.login
                        data.proxy_password = access.password
                    }
                    if (+data.statusId === 3 && +currentAcc.statusId !== 3) {
                        await modules.Log.create({
                            owner: req.id,
                            receiver: currentAcc.userId,
                            operation: 3,
                            description: `Account ${req.body.data.id} has a problem, owner of the account: ${currentAcc.userId}`,
                        });
                    }
                    await modules.Accounts.update({...data}, {
                        where: {
                            id: req.body.data.id
                        }
                    })
                }
            } else {
                await modules.Accounts.create({...data, creator: req.id})
            }
            res.sendStatus(200);
        } catch (e) {
            res.send(e)
        }
    } else {
        res.sendStatus(401)
    }
};

exports.userAccount = async (req, res) => {
    try {
        const account = await modules.Accounts.findByPk(req.body.data.id, {
            attributes: ['userId', 'bmId']
        });
        if (req.id === account.userId) {
            await modules.Accounts.update({archived: req.body.data.archived}, {
                where: {
                    id: req.body.data.id
                }
            });
            await modules.Log.create({
                owner: req.id,
                receiver: req.id,
                operation: 4,
                description: `User ${req.id} ${req.body.data.archived ? `added account ${req.body.data.id} to Archive` : `removed account ${req.body.data.id} from Archive`}`,
            });
            if (account.bmId) {
                await modules.Bms.update({archived: req.body.data.archived}, {
                    where: {
                        id: account.bmId
                    }
                });
                await modules.Log.create({
                    owner: req.id,
                    receiver: req.id,
                    operation: 4,
                    description: `User ${req.id} ${req.body.data.archived ? `added BM ${account.bmId} to Archive` : `removed BM ${account.bmId} from Archive`}`,
                });
            }
            res.sendStatus(200);
        } else {
            res.send('You do not have permission to edit this account')
        }
    } catch (e) {
        res.send(e)
    }
};

exports.accounts = async (req, res) => {
    if (req.permission.acc_bm_update) {
        try {
            await modules.Accounts.bulkCreate(req.body.data);
            res.sendStatus(200);
        } catch (e) {
            res.send(e)
        }
    } else {
        res.sendStatus(401)
    }
};

exports.uuid = async (req, res) => {
    if (req.permission.acc_bm_update) {
        try {
            const data = {
                uuid: req.body.data.uuid,
                id: req.body.data.id
            };

            await modules.Accounts.update({uuid: data.uuid}, {
                where: {
                    id: data.id
                }
            });
            res.sendStatus(200);
        } catch (e) {
            res.send(e)
        }
    } else {
        res.sendStatus(401)
    }
};

exports.multiAccounts = async (req, res) => {
    if (req.permission.acc_bm_update) {
        try {
            let where = {};
            if (req.body.id) where.id = {[Op.startsWith]: req.body.id};
            if (req.body.country) where['$country.id$'] = req.body.country;
            const accounts = await modules.Accounts.findAll({
                attributes: ['id', 'uuid', 'login', 'password', 'email', 'email_password', 'proxy_ip', 'proxy_login', 'proxy_password', 'birth', 'code2fa', 'token'],
                where: where,
                include: {
                    model: modules.Countries,
                },
                order: [
                    ['id', 'DESC']
                ],
                limit: 100
            });
            const countries = await modules.Countries.findAll({
                attributes: ['id', 'name', 'type'],
            });
            res.send({accounts, countries});
        } catch (e) {
            res.send(e)
        }
    } else {
        res.sendStatus(401)
    }
};
exports.multiToken = async (req, res) => {
    if (req.permission.acc_bm_update) {
        try {
            await modules.Accounts.update({token: req.body.token}, {
                where: {
                    login: req.body.login
                }
            });
            res.sendStatus(200)
        } catch (e) {
            res.send(e)
        }
    } else {
        res.sendStatus(401)
    }
};
exports.multiCookies = async (req, res) => {
    if (req.permission.acc_bm_update) {
        try {
            await modules.Accounts.update({cookies: req.body.cookies}, {
                where: {
                    login: req.body.login
                }
            });
            res.sendStatus(200)
        } catch (e) {
            res.send(e)
        }
    } else {
        res.sendStatus(401)
    }
}
exports.proxyTraffic = async (req, res) => {
    try {
        let proxy_id = req.body.data.proxy_id
        let where = {
            id: req.body.data.id,
            proxy_id: proxy_id,
        };
        if (req.admin && req.permission.acc_bm_update) {
            if(proxy_id.includes('p')) {
                proxy_id = proxy_id.substring(1)
                const foundProxy = await getProxy6(proxy_id)
                await modules.Accounts.update({proxy_date:foundProxy.date_end}, {
                    where:where
                })
            } else {
                const result = await axios.get(`https://astroproxy.com/api/v1/ports/${proxy_id}?token=${process.env.PROXY_TOKEN}`);
                await modules.Accounts.update({
                    proxy_traffic_left: result.data.data.traffic.left,
                    proxy_traffic_total: result.data.data.traffic.total
                }, {
                    where: where

                })
            }
        } else {
            where.userId = req.id;
            const account = await modules.Accounts.findOne({
                where: where
            });
            if (account) {
                if(proxy_id.includes('p')) {
                    proxy_id = proxy_id.substring(1)
                    const foundProxy = await getProxy6(proxy_id)
                    await modules.Accounts.update({proxy_traffic_left:foundProxy.date_end}, {
                        where:where
                    })
                } else {
                    const result = await axios.get(`https://astroproxy.com/api/v1/ports/${proxy_id}?token=${process.env.PROXY_TOKEN}`);
                    await modules.Accounts.update({
                        proxy_traffic_left: result.data.data.traffic.left,
                        proxy_traffic_total: result.data.data.traffic.total
                    }, {
                        where: where
                    })
                }
            } else {
                return res.sendStatus(401)
            }
        }
        return res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.sendStatus(404)
    }
};


exports.updateAllProxyTraffic = async (req, res) => {
    try {
        if (req.admin && req.permission.acc_bm_update) {
            const items = req.body.items
            for (let i = 0; i < items.length; i++) {
                const id = items[i]['accountId']
                const proxyId = items[i]['proxyId']
                const where = {
                    id: id,
                    proxy_id: proxyId,
                }
                if (proxyId.includes('p')) {
                    try {
                        const clearedProxy = proxyId.substring(1)
                        const foundProxy = await getProxy6(clearedProxy)
                        await modules.Accounts.update({proxy_traffic_left: foundProxy.date_end}, {
                            where: where
                        })
                    } catch(e) {
                        console.log(e)
                    }
                } else {
                    await axios.get(`https://astroproxy.com/api/v1/ports/${proxyId}?token=${process.env.PROXY_TOKEN}`, {
                        timeout: 5000,
                        headers: {'Accept': 'application/json'}
                    })
                        .then(async (result) => {
                            const response = await modules.Accounts.update({
                                proxy_traffic_left: result.data.data.traffic.left,
                                proxy_traffic_total: result.data.data.traffic.total
                            }, {
                                where: where
                            })
                        })
                        .catch((e) => {
                            console.log(e);
                        })
                }
            }
            res.sendStatus(200)
        } else {
            res.sendStatus(403)
        }
    } catch (e) {
        res.status(500)
    }
}

exports.addProxyTraffic = async (req, res) => {
    try {
        const sumOnAcc = await modules.Users.findByPk(req.id, {
            attributes: ['balance']
        });
        if (req.body.data.proxy_id.includes('p')) {
            const proxy_id = req.body.data.proxy_id.replace('p', '');
            const where = {
                id: req.body.data.id,
                proxy_id: req.body.data.proxy_id,
            };
            if (sumOnAcc.balance - 4 <= 0) res.sendStatus(405);
                const result = await axios.get(`https://proxy6.net/api/${process.env.PROXY_TOKEN_P}/prolong?period=3&ids=${proxy_id}&nokey`);
            if (result.data.status === 'yes') {
                await modules.Accounts.update({proxy_date: result.data.list[0].date_end}, {
                    where: where
                });
                await modules.Users.update({balance: sumOnAcc.balance - 4}, {
                    where: {
                        id: req.id
                    }
                });
                return res.sendStatus(200);
            }
        } else {
            const accountId = req.body.data.id
            const proxy_id = req.body.data.proxy_id;
            const [traffic, money] = req.body.data.trafficAmount.split('-')
            const [amount, key] = traffic.split(' ')
            const convertedMoneyNum = +money.replace('$', '')
            const getVolume = () => {
                switch (amount) {
                    case '600':
                        return '0.3'
                    case '1':
                        return '0.5'
                    case '2':
                        return '1'
                    case '6':
                        return '3'
                    default:
                        break;
                }
            }
            const volume = getVolume();

            const where = {
                id: accountId,
                proxy_id: proxy_id,
            };
            const sumOnAcc = await modules.Users.findByPk(req.id, {
                attributes: ['balance']
            });
            if (+sumOnAcc.balance - convertedMoneyNum <= 0) res.sendStatus(405);
                const result = await axios.post(`https://astroproxy.com/api/v1/ports/${proxy_id}/renew?token=${process.env.PROXY_TOKEN}&volume=${volume}&id=${proxy_id}`,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Accept': 'application/json'
                        },
                    }
                );
                if (result.data.status === 'ok') {
                    await modules.Accounts.update({
                        proxy_traffic_left: result.data.data.traffic.left,
                        proxy_traffic_total: result.data.data.traffic.total
                    }, {
                        where: where
                    });
                    await modules.Users.update({balance: sumOnAcc.balance - convertedMoneyNum}, {
                        where: {
                            id: req.id
                        }
                    });
                    await modules.Log.create({
                        owner: req.id,
                        receiver: req.id,
                        operation: 2,
                        description: `Traffic added: <span class='success'>id:${req.id}, AccountId: ${accountId}</span>: For <b>${amount} - ${money}$</b>,  <span class='primary'>New Traffic State</span>: Total: <b>${result.data.data.traffic.total}</b>, Left: <b>${result.data.data.traffic.left}</b>`,
                        amount: amount
                    });
                    return res.sendStatus(200)
                }
            }
    } catch (e) {
        console.log(e);
        res.sendStatus(405)
    }
};

exports.proxyData = async (req, res) => {
    try {
        if (req.permission.acc_bm_update) {
            let result;
            if (req.body.data.type !== 'p') {
                result = await axios.get(`https://astroproxy.com/api/v1/ports/${req.body.data.proxy_id}?token=${process.env.PROXY_TOKEN}`);
                return res.send(result.data.data);
            } else if(req.body.data.type === 'p') {
                result = await axios.get(`https://proxy6.net/api/${process.env.PROXY6_TOKEN}/getproxy?state=active&nokey`)
                return res.send(result.data.list);
            }
        } else {
            return res.sendStatus(401)
        }
    } catch (e) {
        res.send({error: 'Proxy id is not correct'}).status(400)
        console.log(e);

    }
};