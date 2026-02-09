const { logger } = require("../config/logger");

function errorHandler(err, req, res, next) {
  logger.error({ err, requestId: req.id }, "Unhandled error");

  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Something went wrong",
      requestId: req.id,
    },
  });
}

module.exports = { errorHandler };
