// server.js
require("dotenv").config();
const http = require("http");
const app = require("./src/app");
const { connectMongo } = require("./src/config/mongo");
const { logger } = require("./src/config/logger");

const PORT = process.env.PORT || 3001;

async function start() {
  await connectMongo();

  const server = http.createServer(app);

  server.listen(PORT, () => {
    logger.info({ port: PORT }, "Server running");
  });

  // graceful shutdown
  const shutdown = async (signal) => {
    logger.warn({ signal }, "Shutting down...");
    server.close(async () => {
      try {
        const mongoose = require("mongoose");
        await mongoose.connection.close();
      } catch (e) {}
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
