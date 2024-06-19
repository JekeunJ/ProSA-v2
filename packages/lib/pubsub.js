const { PubSub } = require('@google-cloud/pubsub');

const pubsub = new PubSub({
  projectId: process.env.GOOGLE_SERVICE_PROJECT_ID,
  scopes: 'https://www.googleapis.com/auth/cloud-platform',
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_PRIVATE_KEY,
  },
});

function createSubscription(topic) {
  return pubsub.subscription(`projects/${process.env.GOOGLE_SERVICE_PROJECT_ID}/subscriptions/${topic}-${process.env.GOOGLE_PUBSUB_ENV}`);
}

module.exports = createSubscription;
