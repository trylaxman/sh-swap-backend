const SwapEvent = require("../models/swapEvent.model");

class SwapEventRepo {
  async create(data) {
    return SwapEvent.create(data);
  }

  async listBySwapPublicId(swapPublicId, limit = 50) {
    return SwapEvent.find({ swapPublicId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }
}

module.exports = new SwapEventRepo();
