const pino = require("pino");
const pinoHttp = require("pino-http");

const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  redact: {
    paths: ["req.headers.authorization", "*.walletAddress", "*.address"],
    remove: true,
  },
});

const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => req.id,
});

module.exports = { logger, httpLogger };
