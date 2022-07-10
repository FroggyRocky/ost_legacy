const modules = require('../dbmodels'),
    sequelize = require('sequelize'),
    {Op} = require('sequelize');

exports.data = async function (req, res) {
    /*console.log(req.body);*/
    const userData = {};
    try {
        if (req.id) {
            userData.user = await user();
            userData.user.page = await page();
            userData.faqs = await modules.Faqs.findAll();
            userData.statuses = await modules.Statuses.findAll();
            userData.countries = await modules.Countries.findAll();
            userData.bmTypes = await modules.BmTypes.findAll();
            if (userData.user.admin) {
                userData.logList = await logList();
                userData.userList = await userList();
                userData.userCount = await userCount();
                userData.dashboard = await dashboard();
                userData.accounts = await adminAccounts();
                userData.managerList = await adminManagerList();
                userData.bms = await adminBms();
                userData.archivedAccounts = await adminArchivedAccounts();
                userData.archivedBms = await adminArchivedBms();
                userData.accCount = await adminAccBMCount('a');
                userData.bmCount = await adminAccBMCount('b');
                userData.accArchivedCount = await adminArchivedAccBMCount('a');
                userData.bmArchivedCount = await adminArchivedAccBMCount('b');
            } else {
                userData.manager = await modules.Users.findByPk(userData.user.managerId, {
                    attributes: ['name', 'skype', 'telegram', 'works']
                });
                userData.accounts = await userAccounts();
                userData.bms = await userBms();
                userData.accCount = await userAccBMCount('a');
                userData.bmCount = await userAccBMCount('b');
                userData.archivedAccounts = await userArchivedAccounts();
                userData.archivedBms = await userArchivedBms();
                userData.accArchivedCount = await userArchivedAccBMCount('a');
                userData.bmArchivedCount = await userArchivedAccBMCount('b');
                userData.freeAccounts = await freeAccounts();
                userData.freeBms = await freeBms();
                userData.freeUserBms = await freeUserBms();
            }
            res.send(userData);

            // List of functions

            async function page() {
                if (req.body.data && req.body.data.page && +req.body.data.page !== userData.user.page) {
                    await modules.Users.update({page: +req.body.data.page}, {
                        where: {
                            id: req.id
                        }
                    });
                }
                return (req.body.data && req.body.data.page) || userData.user.page
            }

            async function user() {
                return await modules.Users.findByPk(req.id, {
                    attributes: {
                        exclude: ['password', 'userHistoryId']
                    },
                    include: {
                        model: modules.Permissions
                    }
                });
            }

            async function userArchivedAccounts() {
                let where = {
                    archived: true,
                    userId: req.id
                };
                if (req.body.data && req.body.data.searchId && req.body.data.searchId.aa) {
                    where.id = req.body.data.searchId.aa;
                    return await modules.Accounts.findAll({
                        where: where,
                        include: {
                            model: modules.Bms,
                        }
                    });
                } else {
                    if (req.body.data && req.body.data.from && req.body.data.to) where.bought = {[Op.between]: [req.body.data.from, req.body.data.to]};
                    return await modules.Accounts.findAll({
                        where: where,
                        order: [
                            ['bought', 'DESC'],
                            ['id', 'DESC']
                        ],
                        include: {
                            model: modules.Bms,
                        },
                        offset: req.body.data && (req.body.data.aa ? req.body.data.aa * userData.user.page - userData.user.page : 0),
                        // limit: userData.user.page
                    });
                }
            }

            async function userAccounts() {
                let where = {
                    archived: {[Op.not]: true},
                    userId: req.id
                };
                if (req.body.data && req.body.data.searchId && req.body.data.searchId.a) {
                    where.id = req.body.data.searchId.a;
                    return await modules.Accounts.findAll({
                        where: where,
                        include: {
                            model: modules.Bms,
                        }
                    });

                } else {
                    if (req.body.data && req.body.data.from && req.body.data.to) {
                        where.bought = {[Op.between]: [req.body.data.from, req.body.data.to]};
                    } else if (req.body.data && req.body.data.problem && req.body.data.problem === true) {
                        where.statusId = 3;
                    }
                    return await modules.Accounts.findAll({
                        where: where,
                        order: [
                            ['bought', 'DESC'],
                            ['id', 'DESC']
                        ],
                        include: {
                            model: modules.Bms,
                        },
                        offset: req.body.data && (req.body.data.a ? req.body.data.a * userData.user.page - userData.user.page : 0),
                        // limit: userData.user.page
                    });
                }
            }

            async function userArchivedBms() {
                let where = {
                    userId: req.id,
                    archived: true,
                };
                if (req.body.data && req.body.data.searchId && req.body.data.searchId.ab) {
                    where.id = req.body.data.searchId.ab;
                    return await modules.Bms.findAll({
                        where: where,
                        include: {
                            model: modules.Accounts,
                            attributes: ['id']
                        }
                    });
                } else {
                    if (req.body.data && req.body.data.from && req.body.data.to) where.bought = {[Op.between]: [req.body.data.from, req.body.data.to]};
                    return await modules.Bms.findAll({
                        where: where,
                        order: [
                            ['bought', 'DESC'],
                            ['id', 'DESC']
                        ],
                        include: {
                            model: modules.Accounts,
                            attributes: ['id']
                        },
                        offset: req.body.data && (req.body.data.ab ? req.body.data.ab * userData.user.page - userData.user.page : 0),
                        // limit: userData.user.page
                    });
                }
            }

            async function userBms() {
                let where = {
                    userId: req.id,
                    archived: {[Op.not]: true}
                };
                if (req.body.data && req.body.data.searchId && req.body.data.searchId.b) {
                    where.id = req.body.data.searchId.b;
                    return await modules.Bms.findAll({
                        where: where,
                        include: {
                            model: modules.Accounts,
                            attributes: ['id', 'countryId']
                        },
                    });
                } else {
                    if (req.body.data && req.body.data.from && req.body.data.to) {
                        where.bought = {[Op.between]: [req.body.data.from, req.body.data.to]};
                    } else if (req.body.data && req.body.data.problem && req.body.data.problem === true) {
                        where.statusId = 3;
                    }
                    return await modules.Bms.findAll({
                        where: where,
                        order: [
                            ['bought', 'DESC'],
                            ['id', 'DESC']
                        ],
                        include: {
                            model: modules.Accounts,
                            attributes: ['id', 'countryId']
                        },
                        offset: req.body.data && (req.body.data.b ? req.body.data.b * userData.user.page - userData.user.page : 0),
                        // limit: userData.user.page
                    });
                }
            }

            async function freeUserBms() {
                return await modules.Bms.findAll({
                    where: {
                        userId: req.id,
                        statusId: {[Op.ne]: 3},
                        archived: {[Op.not]: true},
                        '$account.id$': null
                    },
                    include: {
                        model: modules.Accounts,
                    },
                    order: [
                        ['id', 'DESC']
                    ],
                    limit: 20,
                });
            }

            async function freeAccounts() {
                return await modules.Accounts.count({
                    attributes: ['country.id', 'country.price', 'country.name', 'country.description', 'country.type'],
                    where: {
                        userId: null,
                        archived: {[Op.not]: true},
                    },
                    include: {
                        model: modules.Countries,
                    },
                    group: 'countryId'
                });
            }

            async function freeBms() {
                return await modules.Bms.count({
                    attributes: ['bmType.id', 'bmType.price', 'bmType.name', 'bmType.description'],
                    where: {
                        userId: null,
                        archived: {[Op.not]: true}
                    },
                    include: {
                        model: modules.BmTypes,
                    },
                    group: 'bmTypeId'
                });
            }

            async function userAccBMCount(type) {
                let where = {
                    userId: req.id,
                    archived: {[Op.not]: true},
                };
                if (req.body.data && req.body.data.searchId && (req.body.data.searchId.a || req.body.data.searchId.b)) {
                    return 1;
                } else {
                    if (req.body.data && req.body.data.from && req.body.data.to) where.bought = {[Op.between]: [req.body.data.from, req.body.data.to]};
                    if (type === 'a') {
                        return await modules.Accounts.count({
                            where: where
                        });
                    } else {
                        return await modules.Bms.count({
                            where: where
                        });
                    }
                }
            }

            async function userArchivedAccBMCount(type) {
                let where = {
                    userId: req.id,
                    archived: true,
                };
                if (req.body.data && req.body.data.searchId && (req.body.data.searchId.aa || req.body.data.searchId.ab)) {
                    return 1;
                } else {
                    if (req.body.data && req.body.data.from && req.body.data.to) where.bought = {[Op.between]: [req.body.data.from, req.body.data.to]};

                    if (type === 'a') {
                        return await modules.Accounts.count({
                            where: where
                        });
                    } else {
                        return await modules.Bms.count({
                            where: where
                        });
                    }
                }
            }

            async function logList() {

                if (req.permission?.log) {
                    if (req.body.data && req.body.data.searchState) {
                        let searchWhere = {
                            createdAt: {
                                [Op.between]: [req.body.data.searchState.from, req.body.data.searchState.to],
                            }
                        };
                        if (req.body.data.searchState.userId) searchWhere[Op.or] = [{owner: req.body.data.searchState.userId}, {receiver: req.body.data.searchState.userId}];
                        if (req.body.data.searchState.operation !== '0') searchWhere.operation = req.body.data.searchState.operation;
                        return await modules.Log.findAll({
                            where: searchWhere,
                            order: [
                                ['id', 'DESC']]
                        });
                    } else {
                        return await modules.Log.findAll({
                            where: {
                                createdAt: {
                                    [Op.gt]: new Date(new Date().setHours(0, 0, 0, 0)),
                                }
                            },
                            order: [
                                ['id', 'DESC']]
                        });
                    }
                }
            }

            async function userList() {
                if (req.permission.users !== 0) {
                    let where = {};
                    if (req.permission.users === 1) where.managerId = req.id;
                    if (req.body.data && req.body.data.searchId && req.body.data.searchId.u) {
                        where.id = req.body.data.searchId.u;
                        return await modules.Users.findAll({
                            where: where,
                            attributes: {
                                exclude: ['password']
                            },
                            include: {
                                model: modules.Permissions
                            }
                        });
                    } else {
                        if (req.body.data && req.body.data.approved) where.approved = false;
                        if (req.body.data && req.body.data.from && req.body.data.to) where.createdAt = {[Op.between]: [req.body.data.from, req.body.data.to]};
                        return userData.userList = await modules.Users.findAll({
                            where: where,
                            attributes: {
                                exclude: ['password']
                            },
                            order: [
                                ['id', 'DESC']
                            ],
                            include: {
                                model: modules.Permissions
                            },
                            offset: req.body.data && (req.body.data.u ? req.body.data.u * userData.user.page - userData.user.page : 0),
                            // limit: userData.user.page
                        });
                    }
                }
            }

            async function userCount() {
                if (req.permission.users !== 0) {
                    if (req.body.data && req.body.data.searchId && req.body.data.searchId.u) {
                        return 1;
                    } else {
                        console.log('HERE')
                        let where = {};
                        if (req.permission.users === 1) where.managerId = req.id;
                        if (req.body.data && req.body.data.approved) where.approved = false;
                        if (req.body.data && req.body.data.from && req.body.data.to) where.createdAt = {[Op.between]: [req.body.data.from, req.body.data.to]};
                        return userData.userCount = await modules.Users.count({
                            where: where
                        });
                    }
                }
            }

            async function dashboard() {
                if (req.permission.log) {
                    let where = {
                        createdAt: {
                            [Op.gt]: new Date(new Date().setHours(0, 0, 0, 0)),
                        }
                    };
                    const freeAccounts = await modules.Accounts.count({
                        where: {
                            userId: null
                        }
                    });
                    const newAccounts = await modules.Accounts.count({
                        where: where
                    });
                    const newUsers = await modules.Users.count({
                        where: where
                    });
                    return {freeAccounts, newAccounts, newUsers};
                }
            }

            async function adminManagerList() {
                return await modules.Users.findAll({
                    where: {
                        manager: true
                    },
                    attributes: ['id', 'name']
                });
            }

            async function adminAccounts() {
                if (req.permission.acc_bm !== 0) {
                    let where = {archived: {[Op.not]: true}};
                    if (req.permission.acc_bm === 1) where.creator = req.id;
                    if (req.body.data && req.body.data.searchId && req.body.data.searchId.a) {
                        where.id = req.body.data.searchId.a;
                        console.log('HERE')
                        return await modules.Accounts.findAll({
                            where: where,
                            include: {
                                model: modules.Bms,
                            }
                        });
                    } else {
                        if (req.body.data && req.body.data.userId) where.userId = req.body.data.userId;
                        if (req.body.data && req.body.data.problem && req.body.data.problem === true) where.statusId = 3;
                        if (req.body.data && req.body.data.from && req.body.data.to) where.bought = {[Op.between]: [req.body.data.from, req.body.data.to]};
                        return await modules.Accounts.findAll({
                            where: where,
                            order: [
                                ['id', 'DESC']
                            ],
                            include: {
                                model: modules.Bms,
                            },
                            offset: req.body.data && (req.body.data.a ? req.body.data.a * userData.user.page - userData.user.page : 0),
                            // limit: userData.user.page
                        });
                    }
                }
            }

            async function adminBms() {
                if (req.permission.acc_bm !== 0) {
                    let where = {archived: {[Op.not]: true}};
                    if (req.permission.acc_bm === 1) where.creator = req.id;
                    if (req.body.data && req.body.data.searchId && req.body.data.searchId.b) {
                        where.id = req.body.data.searchId.b;
                        return await modules.Bms.findAll({
                            where: where,
                            include: {
                                model: modules.Accounts,
                                attributes: ['id', 'countryId']
                            }
                        });
                    } else {
                        if (req.body.data && req.body.data.userId) where.userId = req.body.data.userId;
                        if (req.body.data && req.body.data.problem && req.body.data.problem === true) where.statusId = 3;
                        if (req.body.data && req.body.data.from && req.body.data.to) where.bought = {[Op.between]: [req.body.data.from, req.body.data.to]};
                        return await modules.Bms.findAll({
                            where: where,
                            order: [
                                ['id', 'DESC']
                            ],
                            include: {
                                model: modules.Accounts,
                                attributes: ['id', 'countryId']
                            },
                            offset: req.body.data && (req.body.data.b ? req.body.data.b * userData.user.page - userData.user.page : 0),
                            // limit: userData.user.page
                        });
                    }
                }
            }

            async function adminArchivedAccounts() {
                if (req.permission.acc_bm !== 0) {
                    let where = {archived: true};
                    if (req.permission.acc_bm === 1) where.creator = req.id;
                    if (req.body.data && req.body.data.searchId && req.body.data.searchId.aa) {
                        where.id = req.body.data.searchId.aa;
                        return await modules.Accounts.findAll({
                            where: where,
                            include: {
                                model: modules.Bms,
                            }
                        });
                    } else {
                        if (req.body.data && req.body.data.userId) where.userId = req.body.data.userId;
                        if (req.body.data && req.body.data.from && req.body.data.to) where.bought = {[Op.between]: [req.body.data.from, req.body.data.to]};
                        return await modules.Accounts.findAll({
                            where: where,
                            order: [
                                ['id', 'DESC']
                            ],
                            include: {
                                model: modules.Bms,
                            },
                            offset: req.body.data && (req.body.data.aa ? req.body.data.aa * userData.user.page - userData.user.page : 0),
                            // limit: userData.user.page
                        });
                    }
                }
            }

            async function adminArchivedBms() {
                if (req.permission.acc_bm !== 0) {
                    let where = {archived: true};
                    if (req.permission.acc_bm === 1) where.creator = req.id;
                    if (req.body.data && req.body.data.searchId && req.body.data.searchId.ab) {
                        where.id = req.body.data.searchId.ab;
                        return await modules.Bms.findAll({
                            where: where,
                            include: {
                                model: modules.Accounts,
                                attributes: ['id']
                            }
                        });
                    } else {
                        if (req.body.data && req.body.data.userId) where.userId = req.body.data.userId;
                        if (req.body.data && req.body.data.from && req.body.data.to) where.bought = {[Op.between]: [req.body.data.from, req.body.data.to]};
                        return await modules.Bms.findAll({
                            where: where,
                            order: [
                                ['id', 'DESC']
                            ],
                            include: {
                                model: modules.Accounts,
                                attributes: ['id']
                            },
                            offset: req.body.data && (req.body.data.ab ? req.body.data.ab * userData.user.page - userData.user.page : 0),
                            // limit: userData.user.page
                        });
                    }
                }
            }

            async function adminAccBMCount(type) {
                if (req.permission.acc_bm !== 0) {
                    if (req.body.data && req.body.data.searchId && (req.body.data.searchId.a || req.body.data.searchId.b)) {
                        return 1;
                    } else {
                        let where = {archived: {[Op.not]: true}};
                        if (req.permission.acc_bm === 1) where.creator = req.id;
                        if (req.body.data && req.body.data.userId) where.userId = req.body.data.userId;
                        if (req.body.data && req.body.data.problem && req.body.data.problem === true) where.statusId = 3;
                        if (req.body.data && req.body.data.from && req.body.data.to) where.bought = {[Op.between]: [req.body.data.from, req.body.data.to]};
                        if (type === 'a') {
                            return await modules.Accounts.count({
                                where: where
                            });
                        } else {
                            return await modules.Bms.count({
                                where: where
                            });
                        }
                    }
                }
            }

            async function adminArchivedAccBMCount(type) {
                if (req.permission.acc_bm !== 0) {
                    if (req.body.data && req.body.data.searchId && (req.body.data.searchId.aa || req.body.data.searchId.ab)) {
                        return 1;
                    } else {
                        let where = {archived: true};
                        if (req.permission.acc_bm === 1) where.creator = req.id;
                        if (req.body.data && req.body.data.userId) where.userId = req.body.data.userId;
                        if (req.body.data && req.body.data.from && req.body.data.to) where.bought = {[Op.between]: [req.body.data.from, req.body.data.to]};
                        if (type === 'a') {

                            return await modules.Accounts.count({
                                where: where
                            });
                        } else {
                            return await modules.Bms.count({
                                where: where
                            });
                        }
                    }
                }
            }

        }
    } catch (e) {
        console.log(e);
        res.send(e)
    }
};