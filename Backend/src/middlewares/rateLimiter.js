const redis = require("../config/redis");

const rateLimiter = async (req,res,next)=>{
    const ip = req.ip;
    const key = `rate_limit:${ip}`

    const requests = await redis.incr(key);
    if(requests===1){
        await redis.expire(key,60);
    }

    const ttl = await redis.ttl(key);

    if(requests>5){
        return res.status(429).json({
            message:`Too many requests, try again after ${ttl} seconds`
           
        })
    }

    next()
}

module.exports = rateLimiter