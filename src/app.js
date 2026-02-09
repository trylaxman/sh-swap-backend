// src/app.js
const express = require("express");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const { loadSwaggerSpec } = require("./docs/swagger");

const { requestId } = require("./middlewares/requestId");
const { httpLogger } = require("./config/logger");
const { corsConfig } = require("./config/cors");
const { apiV1Router } = require("./api/v1/routes");
const { notFound } = require("./middlewares/notFound");
const { errorHandler } = require("./middlewares/errorHandler");


const app = express();

app.use(helmet());
app.use(corsConfig());
// Make preflight never break
app.options(/.*/, corsConfig());

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use(requestId);
app.use(httpLogger);

// Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(loadSwaggerSpec()));

// routes
app.use("/api/v1", apiV1Router);
app.get("/health", (req, res) => res.json({ ok: true }));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
