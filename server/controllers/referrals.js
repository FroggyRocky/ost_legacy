const modules = require('../dbmodels')


exports.getReferralData = async(req,res) => { 
    try {
        const userId = req.id
        const data = await modules.Referrals.findOne({
            where: {
                userId:userId
            },
            attributes:['users_invited', 'referral_revenue', 'referral_level', 'userId']
        })
        res.send(data).status(200)
    } catch(e) {
        res.status(500)
        console.log(e)
    }
}


exports.getInvitedEmails = async (req,res) => {
    try {
    const response = await modules.Users.findAll({
        limit:5,
        attributes:['email'],
        where: {
            referred_user_id:req.id
        },
        order: [ [ 'createdAt', 'DESC' ]]
    })
    res.send(response).status(200)
    } catch(e) {
        console.log(e)
        res.status(500)
    }
    
}