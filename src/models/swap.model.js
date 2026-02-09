const mongoose = require("mongoose");

const SwapSchema = new mongoose.Schema(
  {
    publicId: { type: String, required: true, unique: true, index: true },

    // currencies
    from: {
      symbol: { type: String, required: true }, // e.g. ETH
      chain: { type: String, required: true },  // e.g. ethereum
      amount: { type: String, required: true }, // keep string for precision
    },
    to: {
      symbol: { type: String, required: true }, // e.g. USDT
      chain: { type: String, required: true },
      amountEstimated: { type: String },        // optional
    },

    // user details
    recipientAddress: { type: String, default: null },

    // deposit handling (for Send step)
    deposit: {
      address: { type: String, default: null },
      chain: { type: String, default: null },
      qr: { type: String, default: null }, // optional, you can generate later
      expiresAt: { type: Date, default: null },
      receivedAt: { type: Date, default: null },
      txHash: { type: String, default: null },
    },

    // provider linkage (exchange api etc.)
    provider: {
      name: { type: String, default: null },        // e.g. changenow
      swapId: { type: String, default: null },      // provider swap id
      raw: { type: mongoose.Schema.Types.Mixed },   // optional
    },

    // lifecycle
    status: {
      type: String,
      required: true,
      enum: [
        "SELECT",          // user selecting pair
        "CONFIRM",         // address confirmation
        "SEND",            // waiting for deposit
        "FUNDS_RECEIVED",  // detected deposit
        "SWAPPING",        // provider processing
        "COMPLETED",
        "EXPIRED",
        "FAILED",
      ],
      default: "SELECT",
      index: true,
    },

    lastError: {
      code: { type: String, default: null },
      message: { type: String, default: null },
    },
  },
  { timestamps: true }
);

// Helpful indexes
SwapSchema.index({ "provider.swapId": 1 }, { sparse: true });
SwapSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Swap", SwapSchema);
