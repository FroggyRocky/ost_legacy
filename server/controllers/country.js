const modules = require('../dbmodels');

exports.country = async (req, res) => {
    if (req.permission.price_list_update) {
        try {
            const data = {
                name: req.body.data.name,
                type:req.body.data.type || 'standard',
                price: req.body.data.price,
                description:req.body.data.description
            };
            console.log(data)
            if (req.body.data.id) {
                await modules.Countries.update({...data}, {
                    where: {
                        id: req.body.data.id
                    }
                })
            } else {
                await modules.Countries.create({...data})
            }
            res.sendStatus(200);
        } catch (e) {
            res.send(e)
        }
    } else {
        res.sendStatus(401)
    }
};