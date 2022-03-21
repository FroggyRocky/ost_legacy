const modules = require("../dbmodels");


exports.requisites = async (req,res) => {
try {
    const data = await modules.Requisites.findAll({
        attributes:['currency_ticker', 'currency_name', 'requisites', 'id']
    })
res.send(data)
} catch(e) {
    console.log(e);
}
}


exports.updateReq = async(req,res) => {
    try {
        if(req.admin === true) {
            const data = req.body
            const key = Object.keys(data)[0];
        const response = await modules.Requisites.update({requisites:data[key]}, {
            where:{currency_ticker:key}
        });
        res.send(response);
        }
    } catch(e) {
        console.log(e);
        res.sendStatus(500)
    }
}


exports.createReq = async(req,res) => {
    try {
        
        if(req.admin === true) {
            const data = req.body;
           const response = await modules.Requisites.create({...data})
           res.send(response)
        }
    } catch(e) {
        res.sendStatus(500)
        console.log(e);
    }
 }

exports.deleteReq = async (req,res) => {
     try {
           if(req.admin === true) {
        const response = await modules.Requisites.destroy({
           where: req.body
        })
        res.send(response + '')
    }
     } catch(e) {
         res.sendStatus(500)
         console.log(e)
     }
 }