const { nanoid } = require("nanoid");

function requestId(req, res, next) {
  req.id = req.headers["x-request-id"] || nanoid();
  res.setHeader("x-request-id", req.id);
  next();
}

module.exports = { requestId };
