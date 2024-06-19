/* Connect to databases */
const mongoose = require('lib/mongoose');
const redis = require('lib/redis');

module.exports = async function connect() {
  // Connect to MongoDB
  await mongoose.connect(process.env.DATABASE_URL);

  // Connect to Redis
  await redis.connect();
};
