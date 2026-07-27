const redis = require("../config/redis");
const aiRateLimiter = async (req,res,next) => {
  const userId = req.user.id;
  const key = `ai-request-rate-limit:${userId}`;

  const requests = await redis.incr(key);

  if(requests===1){
    await redis.expire(key,3600); //1 hour
  }

  const ttl = await redis.ttl(key);

  if(requests>10){
    return res.status(429).json({
        message:`You have reached your AI request limit. Try again after ${ttl} seconds.`,

    })
  }
next()

}

module.exports = aiRateLimiter