const redis = require('redis')

const redisClient = redis.createClient(6379)

redisClient.connect();
redisClient.on("error", (error) => {
    console.error(error);
   });

redisClient.on("connect",(err) =>{
    console.log('hii')
})

 module.exports.cli =redisClient;