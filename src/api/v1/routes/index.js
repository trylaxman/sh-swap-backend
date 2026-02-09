const express = require("express");
const apiV1Router = express.Router();
const healthRoutes = require("./health.routes");
const swapRoutes = require("./swap.routes");

apiV1Router.get("/", (req, res) => {
  res.json({ ok: true, version: "v1" });
});

apiV1Router.use("/health", healthRoutes);
apiV1Router.use("/swaps", swapRoutes);

module.exports = { apiV1Router };
