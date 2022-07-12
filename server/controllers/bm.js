const modules = require('../dbmodels'),
    sequelize = require('sequelize');

exports.bm = async (req, res) => {
    if (req.permission.acc_bm_update) {
        try {
            const data = {
                statusId: req.body.data.statusId,
                userId: req.body.data.userId || null,
                bmTypeId: req.body.data.bmTypeId,
                faceBm: req.body.data.faceBm,
                link1: req.body.data.link1,
                link2: req.body.data.link2,
                link3: req.body.data.link3,
                faceToken: req.body.data.faceToken,
                archived: req.body.data.archived || false,
                type:req.body.data.type || null
            };
            if (req.body.data.id) {
                const currentBm = await modules.Bms.findByPk(req.body.data.id, {
                    attributes: ['userId', 'creator']
                });
                if (req.permission.acc_bm === 2 || (req.permission.acc_bm === 1 && currentBm.creator === req.id)) {
                    if (req.body.data.changeBm) {
                        const bm = await modules.Bms.findByPk(req.body.data.changeBm, {
                            include: {
                                model: modules.Accounts
                            }
                        });
                        if (bm.creator !== req.id && req.permission.acc_bm === 1) return res.send('You have to be the creator of both BMs');
                        if (!bm) return res.send('Such BM doesn\'t exist');
                        if (!bm.userId) return res.send('Changed BM must have an owner');
                        if (bm.id === req.body.data.id) return res.send('Impossible to change BM to the same one');
                        if (data.userId) return res.send('This BM already has an owner');
                        if (bm.statusId !== 3) return res.send('Client\'s BM must have a problem');
                        if (data.statusId === 3) return res.send('This BM mastn\'t have problem');
                        if (!data.userId && bm.statusId === 3 && data.statusId !== 3 && bm.userId) {
                            data.userId = bm.userId;
                            data.statusId = 4;
                            data.bought = sequelize.fn('NOW');
                            if (bm.account) {
                                await modules.Accounts.update({bmId: req.body.data.id}, {
                                    where: {
                                        id: bm.account.id
                                    }
                                });
                            }
                            await modules.Bms.update({archived: true}, {
                                where: {
                                    id: req.body.data.changeBm
                                }
                            });
                            await modules.Log.create({
                                owner: req.id,
                                receiver: bm.userId,
                                operation: 3,
                                description: `BM ${req.body.data.changeBm} has been changed to ${req.body.data.id}`,
                            });
                        } else {
                            return res.send('Something went wrong');
                        }
                    }
                    if (data.userId !== currentBm.userId) {
                        let receiver,
                            text;
                        if (data.userId) {
                            data.bought = sequelize.fn('NOW');
                            receiver = data.userId;
                            text = 'added to the user';
                        } else {
                            receiver = currentBm.userId;
                            text = 'archived from the user';
                        }
                        await modules.Log.create({
                            owner: req.id,
                            receiver: receiver,
                            operation: 4,
                            description: `BM ${req.body.data.id} was ${text} ${receiver}`,
                        });
                    }
                    await modules.Bms.update({...data}, {
                        where: {
                            id: req.body.data.id
                        }
                    });
                }
            } else {
                await modules.Bms.create({...data, creator: req.id})
            }
            res.sendStatus(200);
        } catch (e) {
            res.send(e)
        }
    } else {
        res.sendStatus(401)
    }
};

exports.userBm = async (req, res) => {
    try {
        const bm = await modules.Bms.findByPk(req.body.data.id, {
            attributes: ['userId']
        });
        if (req.id === bm.userId) {
            await modules.Bms.update({archived: req.body.data.archived}, {
                where: {
                    id: req.body.data.id
                }
            });
            await modules.Log.create({
                owner: req.id,
                receiver: req.id,
                operation: 4,
                description: `The user ${bm.userId} ${req.body.data.archived ? 'archived' : 'unarchived'} BM ${req.body.data.id}`,
            });
            res.sendStatus(200);
        } else {
            res.send('You don\'t have right to change this BM')
        }
    } catch (e) {
        res.send(e)
    }
};

exports.bmType = async (req, res) => {
    if (req.permission.price_list_update) {
        try {
            const data = {
                name: req.body.data.name,
                type:req.body.data.type,
                price: req.body.data.price,
                description: req.body.data.description
            };
            if (req.body.data.id) {
                await modules.BmTypes.update({...data}, {
                    where: {
                        id: req.body.data.id
                    }
                })
            } else {
                await modules.BmTypes.create({...data})
            }
            res.sendStatus(200);
        } catch (e) {
            res.send(e)
        }
    } else {
        res.sendStatus(401)
    }
};

exports.bms = async (req, res) => {
    if (req.permission.acc_bm_update) {
        try {
            await modules.Bms.bulkCreate(req.body.data);
            res.sendStatus(200);
        } catch (e) {
            res.send(e)
        }
    } else {
        res.sendStatus(401)
    }
};