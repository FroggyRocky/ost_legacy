const modules = require('../dbmodels');

exports.getPhones = async (req, res) => {
    if (req.permission.faq_update) {
        try {
            let where = {};
            if (req.body.host) where.host = req.body.host;
            const phones =  await modules.Phones.findAll({
                where: where,
                order: [
                    ['id', 'DESC']
                ],
                limit: 200
            });
            const hosts =  await modules.Phones.findAll({
                attributes: ['host'],
                group: ['host']
            });
            res.send({phones, hosts});
        } catch (e) {
            res.send(e)
        }
    } else {
        res.sendStatus(401)
    }
};
exports.setPhone = async (req, res) => {
    if (req.body.header === '7YvF3@q!e+K+aW7M') {
        try {
            const data = {
                host: req.body.host,
                name: req.body.name,
                phone: req.body.phone,
                text: ''
            };
            await modules.Phones.create(data);
            res.sendStatus(200);
        } catch (e) {
            console.log(req.body.host + ' ' + e);
        }
    } else {
        res.sendStatus(401)
    }
};
exports.adminPhone = async (req, res) => {
    if (req.permission.faq_update) {
        try {
            await modules.Phones.update({text: req.body.text}, {
                where: {
                    id: req.body.id
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
exports.adminPhoneDelete = async (req, res) => {
    if (req.permission.faq_update) {
        try {
            await modules.Phones.destroy({
                where: {
                    id: req.body.id
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