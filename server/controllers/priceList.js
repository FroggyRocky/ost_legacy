const modules = require("../dbmodels");

exports.requisites = async (req,res) => {
try {
    const data = await modules.Requisites.findAll({
        attributes:['currency_name', 'requisites', 'id']
    })
res.send(data)
} catch(e) {
    console.log(e);
}
}


exports.changeReq = async(req,res) => {
    try {
        if(req.admin === true) {
    }
} catch(e) {
        console.log(e);
        res.sendStatus(500)
    }
}