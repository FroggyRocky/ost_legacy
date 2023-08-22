const redis = require('redis');

module.exports = redis.createClient({
    host: '127.0.0.1',
    port: 6379,
    password: process.env.REDIS_PASS
});



