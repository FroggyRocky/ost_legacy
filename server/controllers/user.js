const modules = require('../dbmodels'),
    bcrypt = require('bcrypt');

exports.adminUser = async (req, res) => {
    if (req.permission.user_update) {
        try {
            const user = await modules.Users.findByPk(req.body.data.id, {
                attributes: ['balance', 'managerId', 'email', 'manager']
            });
            if (req.permission.users === 2 || (req.permission.users === 1 && user.managerId === req.id)) {
                const data = {
                    managerId: req.body.data.managerId
                };
                if (req.permission.user_active) data.active = req.body.data.active;
                if (req.permission.user_balance) {
                    data.balance = req.body.data.balance;
                    if (user.balance !== data.balance) {
                        await modules.Log.create({
                            owner: req.id,
                            receiver: req.body.data.id,
                            operation: 1,
                            description: `Changed balance from ${user.balance} to ${data.balance}`,
                            amount: data.balance - user.balance
                        });
                    }
                }
                if (req.permission.user_roles) {
                    data.name = req.body.data.name;
                    data.email = req.body.data.email;
                    data.manager = req.body.data.manager;
                    data.admin = req.body.data.admin;
                    data.works = req.body.data.works;
                    if (user.manager !== data.manager) {
                        await modules.Log.create({
                            owner: req.id,
                            receiver: req.body.data.id,
                            operation: 5,
                            description: `Admin ${req.id} ${data.manager ? 'stated a manager' : 'dismiss as a manager'} ${req.body.data.id}`,
                        });
                    }
                    if (user.managerId !== data.managerId) {
                        await modules.Log.create({
                            owner: req.id,
                            receiver: req.body.data.id,
                            operation: 5,
                            description: `Replaced the manager: ${user.managerId} to ${data.managerId}`,
                        });
                    }
                    if (user.email !== data.email) {
                        await modules.Log.create({
                            owner: req.id,
                            receiver: req.body.data.id,
                            operation: 5,
                            description: `Changed email from ${user.email} to ${data.email}`,
                        });
                    }
                    let userPermissions = await modules.Permissions.findOne({
                        where: {
                            userId: req.body.data.id
                        }
                    });
                    if(!userPermissions) {
                        const data = {
                            acc_bm:req.body.data.permissions.acc_bm,
                            acc_bm_update:req.body.data.permissions.acc_bm_update,
                            users:req.body.data.permissions.users,
                            user_update:req.body.data.permissions.user_update,
                            user_balance: req.body.data.permissions.user_balance,
                            user_active:req.body.data.permissions.user_active,
                            user_roles:req.body.data.permissions.user_roles,
                            statistics:req.body.data.permissions.statistics,
                            price_list:req.body.data.permissions.price_list,
                            price_list_update:req.body.data.permissions.price_list_update,
                            log: req.body.data.permissions.log,
                            faq_update:req.body.data.permissions.faq_update,
                            userId:req.body.data.id
                        }
                        userPermissions = await modules.Permissions.create({...data}, {raw:true});
                        userPermissions = userPermissions.dataValues
                    }
                    if (userPermissions) {
                        let dataDescription = '';
                        if (userPermissions.acc_bm !== req.body.data.permissions.acc_bm) dataDescription += `<div>Acc-BM read</div><div>${(userPermissions.acc_bm === 0 && '') || (userPermissions.acc_bm === 1 && 'Own') || (userPermissions.acc_bm === 2 && 'All')}</div><div>${(req.body.data.permissions.acc_bm === 0 && '-') || (req.body.data.permissions.acc_bm === 1 && 'Own') || (req.body.data.permissions.acc_bm === 2 && 'All')}</div>`;
                        if (userPermissions.acc_bm_update !== req.body.data.permissions.acc_bm_update) dataDescription += `<div>Acc-BM edit</div><div>${userPermissions.acc_bm_update ? '+' : '-'}</div><div>${req.body.data.permissions.acc_bm_update ? '+' : '-'}</div>`;
                        if (userPermissions.users !== req.body.data.permissions.users) dataDescription += `<div>Users read</div><div>${(userPermissions.users === 0 && '-') || (userPermissions.users === 1 && 'Own') || (userPermissions.users === 2 && 'All')}</div><div>${(req.body.data.permissions.users === 0 && '-') || (req.body.data.permissions.users === 1 && 'Own') || (req.body.data.permissions.users === 2 && 'All')}</div>`;
                        if (userPermissions.user_update !== req.body.data.permissions.user_update) dataDescription += `<div>Users edit</div><div>${userPermissions.user_update ? '+' : '-'}</div><div>${req.body.data.permissions.user_update ? '+' : '-'}</div>`;
                        if (userPermissions.user_balance !== req.body.data.permissions.user_balance) dataDescription += `<div>Balance</div><div>${userPermissions.user_balance ? '+' : '-'}</div><div>${req.body.data.permissions.user_balance ? '+' : '-'}</div>`;
                        if (userPermissions.user_active !== req.body.data.permissions.user_active) dataDescription += `<div>Active</div><div>${userPermissions.user_active ? '+' : '-'}</div><div>${req.body.data.permissions.user_active ? '+' : '-'}</div>`;
                        if (userPermissions.user_roles !== req.body.data.permissions.user_roles) dataDescription += `<div>Roles</div><div>${userPermissions.user_roles ? '+' : '-'}</div><div>${req.body.data.permissions.user_roles ? '+' : '-'}</div>`;
                        if (userPermissions.statistics !== req.body.data.permissions.statistics) dataDescription += `<div>Statistics</div><div>${userPermissions.statistics ? '+' : '-'}</div><div>${req.body.data.permissions.statistics ? '+' : '-'}</div>`;
                        if (userPermissions.price_list !== req.body.data.permissions.price_list) dataDescription += `<div>Price read</div><div>${userPermissions.price_list ? '+' : '-'}</div><div>${req.body.data.permissions.price_list ? '+' : '-'}</div>`;
                        if (userPermissions.price_list_update !== req.body.data.permissions.price_list_update) dataDescription += `<div>Price edit</div><div>${userPermissions.price_list_update ? '+' : '-'}</div><div>${req.body.data.permissions.price_list_update ? '+' : '-'}</div>`;
                        if (userPermissions.log !== req.body.data.permissions.log) dataDescription += `<div>Log</div><div>${userPermissions.log ? '+' : '-'}</div><div>${req.body.data.permissions.log ? '+' : '-'}</div>`;
                        if (userPermissions.faq_update !== req.body.data.permissions.faq_update) dataDescription += `<div>FAQ edit</div><div>${userPermissions.faq_update ? '+' : '-'}</div><div>${req.body.data.permissions.faq_update ? '+' : '-'}</div>`;
                        if (dataDescription) {
                            await modules.Permissions.update(req.body.data.permissions, {
                                where: {
                                    userId: req.body.data.id
                                }
                            });
                            await modules.Log.create({
                                owner: req.id,
                                receiver: req.body.data.id,
                                operation: 5,
                                description: `<div class="log-roles">${dataDescription}</div>`,
                            });
                        }
                    }
                }
                await modules.Users.update({ ...data }, {
                    where: {
                        id: req.body.data.id
                    }
                });
                res.sendStatus(200);
            } else {
                return res.sendStatus(401);
            }
        } catch (e) {
            res.send(e)
        }
    } else {
        res.sendStatus(401);
    }
};

exports.user = async (req, res) => {
    const passwords = {
        password: req.body.data.password,
        newPassword: req.body.data.newPassword,
    };
    const data = {
        telegram: req.body.data.telegram,
        skype: req.body.data.skype,
        mla: req.body.data.mla,
        ru: req.body.data.ru,
        auth: req.body.data.auth,
        telMessages: req.body.data.telMessages,
    };
    if (passwords.password !== '') {
        try {
            const user = await modules.Users.findByPk(req.id);
            if (bcrypt.compareSync(passwords.password, user.password)) {
                data.password = bcrypt.hashSync(passwords.newPassword, 10);
                await modules.Users.update(data, {
                    where: {
                        id: req.id
                    }
                });
                res.sendStatus(200);
            } else {
                res.send('You enter wrong password')
            }
        } catch (e) {
            res.send(e)
        }
    } else {
        try {
            await modules.Users.update(data, {
                where: {
                    id: req.id
                }
            });
            res.sendStatus(200);
        } catch (e) {
            res.send(e)
        }
    }

};


exports.addAdmin = async (req, res) => {
    try {
        const adminInfo = {
            email: 'digital.bleep@gmail.com',
            password: bcrypt.hashSync('admin', 10),
            admin: 1,
            approved: 1,
            email_confirmed: 1
        };
        await modules.Users.create(adminInfo);
        const admin = await modules.Users.findOne({
            where: {
                email: adminInfo.email
            }
        });
        await modules.Permissions.create({
            acc_bm: 2,
            acc_bm_update: true,
            users: 2,
            user_update: true,
            user_balance: true,
            user_roles: true,
            user_active: true,
            statistics: true,
            price_list: true,
            price_list_update: true,
            log: true,
            faq_update: true,
            userId: admin.id
        });
        await modules.Statuses.bulkCreate([{ name: 'Ready' }, { name: 'In process' }, { name: 'Problem' }, { name: 'Replaced' }]);
        res.send('Admin added')
    } catch (e) {
        res.send(e)
    }
};
