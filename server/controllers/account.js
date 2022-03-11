const modules = require('../dbmodels'),
    sequelize = require('sequelize'),
    {Op} = require('sequelize'),
    axios = require('axios');
    require('dotenv').config();

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
                code2fa: req.body.data.code2fa,
                agent: req.body.data.agent,
                resolution: req.body.data.resolution,
                language: req.body.data.language,
                platform: req.body.data.platform,
                concurrency: req.body.data.concurrency,
                proxy: req.body.data.proxy || 'HTTP',
                proxy_id: req.body.data.proxy_id || null,
                proxy_ip: req.body.data.proxy_ip,
                proxy_login: req.body.data.proxy_login,
                proxy_password: req.body.data.proxy_password,
                userId: req.body.data.userId || null,
                selfie: req.body.data.selfie,
                token: req.body.data.token,
                archived: req.body.data.archived || false
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

exports.accounts = async (req, res) => { console.log(req.body.data)
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
            console.log(data);
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
            const accounts =  await modules.Accounts.findAll({
                attributes: ['id', 'uuid', 'login', 'password', 'email', 'email_password','proxy_ip', 'proxy_login', 'proxy_password', 'birth', 'code2fa', 'token'],
                where: where,
                include: {
                    model: modules.Countries,
                },
                order: [
                    ['id', 'DESC']
                ],
                limit: 100
            });
            const countries =  await modules.Countries.findAll({
                attributes: ['id', 'name'],
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
exports.proxyTraffic = async (req, res) => {
    try {
        let where = {
            id: req.body.data.id,
            proxy_id: req.body.data.proxy_id,
        };
        if (req.admin && req.permission.acc_bm_update) {
            const result = await axios.get(`https://astroproxy.com/api/v1/ports/${req.body.data.proxy_id}?token=${process.env.PROXY_TOKEN}`);
            await modules.Accounts.update({proxy_traffic_left: result.data.data.traffic.left, proxy_traffic_total: result.data.data.traffic.total}, {
                where: where

            })
        } else {
            where.userId = req.id;
            const account =  await modules.Accounts.findOne({
                where: where
            });
            if (account) {
                const result = await axios.get(`https://astroproxy.com/api/v1/ports/${req.body.data.proxy_id}?token=${process.env.PROXY_TOKEN}`);
                await modules.Accounts.update({proxy_traffic_left: result.data.data.traffic.left, proxy_traffic_total: result.data.data.traffic.total}, {
                    where: where
                })
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
exports.addProxyTraffic = async (req, res) => {
    try {
        let proxy_id;
        let proxy_type;
        if (req.body.data.proxy_id.includes('p')) {
            proxy_id = req.body.data.proxy_id.replace('p', '');
            proxy_type = 'p';
        } else {
            proxy_id = req.body.data.proxy_id;
        }
        const where = {
            id: req.body.data.id,
            proxy_id: req.body.data.proxy_id,
        };
        const sumOnAcc = await modules.Users.findByPk(req.id, {
            attributes: ['balance']
        });
        if (sumOnAcc.balance - 4 >= 0) {
            if (proxy_type === 'p') {
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
                const result = await axios.post(`https://astroproxy.com/api/v1/ports/${req.body.data.proxy_id}/renew?token=${process.env.PROXY_TOKEN}&volume=0.1`,
                    {'volume': '0.1'},
                    {headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'},
                    });
                if (result.data.status === 'ok') {
                    await modules.Accounts.update({proxy_traffic_left: result.data.data.traffic.left, proxy_traffic_total: result.data.data.traffic.total}, {
                        where: where
                    });
                    await modules.Users.update({balance: sumOnAcc.balance - 4}, {
                        where: {
                            id: req.id
                        }
                    });
                    return res.sendStatus(200)
                }
            }
        } else {
            res.sendStatus(405)
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
            } else {
                result = await axios.get(`https://proxy6.net/api/${process.env.PROXY_TOKEN_P}/getproxy?state=active&nokey`);
                return res.send(result.data);
            }
        } else {
            return res.sendStatus(401)
            
        }
    } catch (e) {
        console.log(e);
        
    }
};