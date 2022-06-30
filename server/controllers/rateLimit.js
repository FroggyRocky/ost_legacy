const redis = require('../redisConnection')



exports.rateLimiter = async (req, res, next) => {
    try {
    const userId = req.id;
    const statisticsRequests = await redis.incr(`${userId}`)
    console.log(statisticsRequests)
    if(statisticsRequests == 1) {
        await redis.expire(`${userId}`, 120)
        next()
    } else if(statisticsRequests > 40) {
        res.send({error: {message: 'Request limit is exceeded'}})
    } else {
        next()
    }
    
    } catch(e) {
        console.log(e)
    }
}



