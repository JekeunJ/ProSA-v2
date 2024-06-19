/* Script to empty Redis */
const redis = require('lib/redis');

async function main() {
  await redis.connect();

  await redis.flushDb();

  process.exit(0);
}

main();
