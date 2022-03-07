const modules = require('../dbmodels');

exports.faqPost = async (req, res) => {
    if (req.permission.faq_update) {
        try {
            const data = {
                header: req.body.data.header,
                text: req.body.data.text,
            };
            if (req.body.data.id) {
                await modules.Faqs.update({...data}, {
                    where: {
                        id: req.body.data.id
                    }
                })
            } else {
                await modules.Faqs.create({...data})
            }
            res.sendStatus(200);
        } catch (e) {
            res.send(e)
        }
    } else {
        res.sendStatus(401)
    }
};

exports.faqDelete = async (req, res) => {
    if (req.permission.faq_update) {
        try {
            await modules.Faqs.destroy({
                where: {
                    id: req.body.data
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