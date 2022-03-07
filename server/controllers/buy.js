const modules = require('../dbmodels'),
    sequelize = require('sequelize'),
    {Op} = require('sequelize');

exports.buy = async (req, res) => {
    try {
        const buy = {
            type: req.body.data.type,
            country: req.body.data.country,
            bmType: req.body.data.bmType,
            qty: req.body.data.qty
        };
        const sumOnAcc = await modules.Users.findByPk(req.id, {
            attributes: ['balance']
        });
        switch (buy.type) {
            case 'ab':
                try {
                    const country = await modules.Countries.findByPk(buy.country);
                    const bm = await modules.BmTypes.findByPk(buy.bmType);
                    const sum = country.price * buy.qty + bm.price * buy.qty;
                    if (sum <= sumOnAcc.balance && sum > 0) {
                        const accArray = await modules.Accounts.findAll({
                            attributes: ['id'],
                            where: {
                                userId: null,
                                countryId: buy.country,
                                archived: {[Op.not]: true}
                            },
                            raw: true,
                            limit: buy.qty
                        });
                        const bmsArray = await modules.Bms.findAll({
                            attributes: ['id'],
                            where: {
                                userId: null,
                                bmTypeId: buy.bmType,
                                archived: {[Op.not]: true}
                            },
                            raw: true,
                            limit: buy.qty
                        });
                        const simpleBmArray = bmsArray.map(bm => bm.id);
                        const simpleAccArray = accArray.map(acc => acc.id);
                        if (bmsArray.length === buy.qty && accArray.length === buy.qty) {
                            await modules.Bms.update({userId: req.id, bought: sequelize.fn('NOW')}, {
                                where: {
                                    id: {
                                        [Op.in]: simpleBmArray
                                    }
                                }
                            });
                            await modules.Accounts.update({userId: req.id, bought: sequelize.fn('NOW')}, {
                                where: {
                                    id: {
                                        [Op.in]: simpleAccArray
                                    }
                                }
                            });
                            const fullArray = accArray.map((acc, i) => {
                                return {id: acc.id, bmId: bmsArray[i].id}
                            });
                            await Promise.all(fullArray.map(async acc =>
                                await modules.Accounts.update({bmId: acc.bmId}, {
                                    where: {
                                        id: acc.id
                                    }
                                })
                            ));
                            await modules.Users.update({balance: sumOnAcc.balance - sum}, {
                                where: {
                                    id: req.id
                                }
                            });
                            await modules.Log.create({
                                owner: req.id,
                                receiver: req.id,
                                operation: 2,
                                description: `Bought Account+BM: <span class='success'>${country.name}</span>: <b>${simpleAccArray.join()}</b>, BM <span class='primary'>${bm.name}</span>: <b>${simpleBmArray.join()}</b>`,
                                amount: sum
                            });
                            res.sendStatus(200);
                        } else {
                            res.send('Operation is not possible to fulfil under the data you filled in')
                        }
                    }
                } catch (e) { 
                    res.send(e)
                }
                break;
            case 'a':
                try {
                    const country = await modules.Countries.findByPk(buy.country);
                    const sum = country.price * buy.qty;
                    if (sum <= sumOnAcc.balance && sum > 0) {
                        try {
                            const accArray = await modules.Accounts.findAll({
                                attributes: ['id'],
                                where: {
                                    userId: null,
                                    countryId: buy.country,
                                    archived: {[Op.not]: true},
                                },
                                raw: true,
                                limit: buy.qty
                            });
                            const simpleAccArray = accArray.map(acc => acc.id);
                            if (accArray.length === buy.qty) {
                                await modules.Accounts.update({userId: req.id, bought: sequelize.fn('NOW')}, {
                                    where: {
                                        id: {
                                            [Op.in]: simpleAccArray
                                        }
                                    }
                                });
                                await modules.Users.update({balance: sumOnAcc.balance - sum}, {
                                    where: {
                                        id: req.id
                                    }
                                });
                                await modules.Log.create({
                                    owner: req.id,
                                    receiver: req.id,
                                    operation: 2,
                                    description: `Bought Account <span class='success'>${country.name}</span>: <b>${simpleAccArray.join()}</b>`,
                                    amount: sum
                                });
                            }
                        } catch (e) {
                            res.send('Something went wrong, The Account wasn&apos;t bought')
                        }
                    } else {
                        res.send('Not sufficient fund')
                    }
                    res.sendStatus(200);
                } catch (e) {
                    res.send('Something went wrong')
                }
                break;
            default:
                try {
                    const bm = await modules.BmTypes.findByPk(buy.bmType);
                    const sum = bm.price * buy.qty;
                    if (sum <= sumOnAcc.balance && sum > 0) {
                        try {
                            const bmsArray = await modules.Bms.findAll({
                                attributes: ['id'],
                                where: {
                                    userId: null,
                                    bmTypeId: buy.bmType,
                                    archived: {[Op.not]: true}
                                },
                                raw: true,
                                limit: buy.qty
                            });
                            const simpleBmArray = bmsArray.map(bm => bm.id);
                            if (bmsArray.length === buy.qty) {
                                await modules.Bms.update({userId: req.id, bought: sequelize.fn('NOW')}, {
                                    where: {
                                        id: {
                                            [Op.in]: simpleBmArray
                                        }
                                    }
                                });
                                await modules.Users.update({balance: sumOnAcc.balance - sum}, {
                                    where: {
                                        id: req.id
                                    }
                                });
                                await modules.Log.create({
                                    owner: req.id,
                                    receiver: req.id,
                                    operation: 2,
                                    description: `BM was bought: <span class='primary'>${bm.name}</span>: <b>${simpleBmArray.join()}</b>`,
                                    amount: sum
                                });
                            }
                        } catch (e) {
                            res.send('Something went wrong, BM wasn&apos;t bought')
                        }
                    } else {
                        res.send('No sufficient funds')
                    }
                    res.sendStatus(200);
                } catch (e) {
                    res.send('Something went wrong')
                }
        }
    } catch (e) {
        res.sendStatus(401)
    }
};