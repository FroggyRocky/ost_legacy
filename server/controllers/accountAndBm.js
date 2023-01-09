const modules = require('../dbmodels');

exports.problem = async (req, res) => {
    try {
        if (req.body.data.type === 'b') {
            const bm = await modules.Bms.findByPk(req.body.data.id, {
                attributes: ['userId']
            });
            if (req.id === bm.userId) {
                await modules.Bms.update({statusId: 3}, {
                    where: {
                        id: req.body.data.id
                    }
                });
                await modules.Log.create({
                    owner: req.id,
                    receiver: req.id,
                    operation: 3,
                    description: `BM ${req.body.data.id} has a problem, owner of the BM: ${req.id}`,
                });
                res.sendStatus(200);
            } else {
                res.send('You are permitted to change this BM')
            }
        }
        else {
            const account = await modules.Accounts.findByPk(req.body.data.id, {
                attributes: ['userId']
            });
            if (req.id === account.userId) {
                await modules.Accounts.update({statusId: 3}, {
                    where: {
                        id: req.body.data.id
                    }
                });
                await modules.Log.create({
                    owner: req.id,
                    receiver: req.id,
                    operation: 3,
                    description: `Account ${req.body.data.id} has a problem, owner of the Account: ${req.id}`,
                });
                res.sendStatus(200);
            } else {
                res.send('You are not permitted to change this account')
            }
        }
    } catch (e) {
        res.send(e)
    }
};

exports.bmToAcc = async (req, res) => {
    try {
        const bm = await modules.Bms.findByPk(req.body.data.bmId, {
            attributes: ['userId']
        });
        const account = await modules.Accounts.findByPk(req.body.data.accId, {
            attributes: ['userId', 'bmId']
        });
        if (req.id === bm.userId && req.id === account.userId && !account.bmId) {
            await modules.Accounts.update({bmId: req.body.data.bmId}, {
                where: {
                    id: req.body.data.accId
                }
            });
            res.sendStatus(200);
        } else {
            res.send('Something is wrong');
        }
    } catch (e) {
        res.send(e)
    }
};
exports.skip = async (req, res) => {
    if (req.id === 1) {
        try {
            if (req.body.data.type === 'acc') {
                const data = {
                    statusId: 1,
                    countryId: 1,
                    login: 1,
                    password: 1,
                    email: 1,
                    email_password: 1,
                    proxy_id: null,
                    userId: null,
                    archived: true
                };
                const account = await modules.Accounts.create({...data, creator: req.id});
                await account.increment('id', { by: req.body.data.skip.acc });
                await modules.Accounts.destroy({
                    where: {
                        id: account.id + Number(req.body.data.skip.acc)
                    }
                });
            } else {
                const data = {
                    statusId: 1,
                    userId: null,
                    bmTypeId: 1,
                    archived: true
                };
                const bm = await modules.Bms.create({...data, creator: req.id});
                await bm.increment('id', { by: req.body.data.skip.bm });
                await modules.Bms.destroy({
                    where: {
                        id: bm.id + Number(req.body.data.skip.bm)
                    }
                });
            }
            res.sendStatus(200)
        } catch (e) {
            console.log(e);
            res.sendStatus(500)
        }
    } else {
        res.sendStatus(405)
    }
};