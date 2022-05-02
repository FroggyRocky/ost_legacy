const modules = require('../dbmodels')


exports.getReferralData = async(req,res) => { 
    try {
        const id = req.id
        const data = await modules.Referrals.findOne({
            where: {
                userId:id
            },
            attributes:['invited_referrals', 'referral_revenue', 'referral_level', 'userId']
        })
        res.send(data)
    } catch(e) {
        res.status(500)
        console.log(e)
    }
}