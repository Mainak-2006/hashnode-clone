const mongoose = require('mongoose');

let memoryServer = null;

const getMongoUri = async () => {
  if (process.env.USE_MEMORY_DB === 'true') {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    return memoryServer.getUri('hashnode-clone');
  }

  return process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hashnode-clone';
};

const connectDB = async () => {
  const uri = await getMongoUri();

  mongoose.set('strictQuery', true);
  const connection = await mongoose.connect(uri);

  console.log(
    `MongoDB connected: ${connection.connection.host}/${connection.connection.name}`
  );

  return connection;
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};

module.exports = { connectDB, disconnectDB };
