const modules = require('../dbmodels'),
nodemailer = require('nodemailer')


// const transporter = nodemailer.createTransport({
//     host: 'cpanel1.v.fozzy.com',
//     port: 465,
//     secure: true,
//     auth: {
//         user: process.env.EMAIL_LOGIN,
//         pass: process.env.EMAIL_PASSWORD
//     },
//     tls: {rejectUnauthorized: false}
// });

exports.sendGeneralMail = async (req, res) => {

        console.log(req.body)
    // const mailConfig = {
    //     from:'info@ostproduct.com',
    //     to: 'dendvo@ya.ru',
    //     html:
    //     subject:req.data.mailSubject
    // }
        
    
}

exports.getUsersMailData = async(req,res) => {
    try{
    const data = await modules.Users.findAll({
        attributes: ['id', 'email'],
    });
    res.send(data).status(200)
} catch(e) {
    console.log(e)
    res.status(500)
}
}


exports.sendOptionalMail = async(req, res) => {
   
        console.log(req.body)
    
}