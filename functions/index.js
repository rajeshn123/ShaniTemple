const { onRequest } = require('firebase-functions/v2/https');
const app = require('./app');

// Expose Express API as a 2nd Gen Cloud Function in asia-south1 (Mumbai)
exports.api = onRequest(
  {
    region: 'asia-south1',
    memory: '256MiB',
    timeoutSeconds: 60,
    cors: true,
    minInstances: 0,
    maxInstances: 10
  },
  app
);
