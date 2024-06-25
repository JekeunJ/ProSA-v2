const Queue = require('bull');
const mongoose = require('lib/mongoose');
const pubsub = require('lib/pubsub');
const redis = require('lib/redis');
const throng = require('throng');

async function start() {
  // Connect to database
  await mongoose.connect(process.env.DATABASE_URL);

  // Connect to Redis
  await redis.connect();

  // Connect to named work queues
  // const diagnosisQueue = new Queue('diagnosis', process.env.REDIS_URL);

  // Connect to GCS subscriptions
  // const trainModelSub = pubsub('train-model');

  // Attach work handlers to queues
  // diagnosisQueue.process(50, diagnosisHandler);

  // Attach work handlers to subscriptions
  // trainModelSub.on('message', trainModelHandler);
}

throng({
  worker: start,
  count: process.env.WORKER_CONCURRENCY || 1,
  lifetime: Infinity,
});
