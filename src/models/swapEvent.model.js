const mongoose = require("mongoose");

const SwapEventSchema = new mongoose.Schema(
  {
    swapPublicId: { type: String, required: true, index: true },

    type: {
      type: String,
      required: true,
      enum: [
        "STATUS_CHANGED",
        "ADDRESS_SET",
        "DEPOSIT_ADDRESS_CREATED",
        "DEPOSIT_DETECTED",
        "PROVIDER_CREATED",
        "PROVIDER_UPDATED",
        "COMPLETED",
        "FAILED",
        "EXPIRED",
      ],
      index: true,
    },

    // Snapshot / metadata for debugging & future admin
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

SwapEventSchema.index({ swapPublicId: 1, createdAt: -1 });

module.exports = mongoose.model("SwapEvent", SwapEventSchema);
