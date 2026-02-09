const YAML = require("yamljs");
const path = require("path");

function loadSwaggerSpec() {
  const base = YAML.load(path.join(__dirname, "swagger/openapi.yaml"));
  const swaps = YAML.load(path.join(__dirname, "swagger/paths/swaps.yaml"));

  return {
    ...base,
    paths: {
      ...(base.paths || {}),
      ...(swaps.paths || {}),
    },
  };
}

module.exports = { loadSwaggerSpec };
