// Backwards-compatible entry point. The real server lives in server.js.
const { startServer } = require('./server');

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
