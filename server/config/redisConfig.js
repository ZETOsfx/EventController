const redis = require('redis');             // Redis client 

// Cache server client connection   
const cache = redis.createClient(6379);

// If error connection 
cache.on("error", (error) =>
{
    console.error(error);
});

module.exports = cache;