const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

client.on('error', (err) => {
  if (process.env.NODE_ENV !== 'production') console.log(err);
});

module.exports = client;
