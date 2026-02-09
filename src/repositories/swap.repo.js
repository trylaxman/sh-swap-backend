const Swap = require("../models/swap.model");

class SwapRepo {
  async create(data) {
    return Swap.create(data);
  }

  async findByPublicId(publicId) {
    return Swap.findOne({ publicId }).lean();
  }

  async findOne(filter) {
    return Swap.findOne(filter).lean();
  }

  async updateByPublicId(publicId, update) {
    return Swap.findOneAndUpdate({ publicId }, update, { new: true }).lean();
  }

  async setStatus(publicId, status) {
    return Swap.findOneAndUpdate({ publicId }, { status }, { new: true }).lean();
  }

  async list(filter = {}, limit = 20) {
    return Swap.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
  }
}

module.exports = new SwapRepo();
