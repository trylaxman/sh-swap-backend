const crypto = require("crypto");

function newPublicId(prefix = "swp") {
  // e.g. swp_9f2c1a0e3b4d5e6f
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
}

module.exports = { newPublicId };
