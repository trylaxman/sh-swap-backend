const swapRepo = require("../repositories/swap.repo");

async function getQuote(payload) {
  // TODO: integrate exchange API later
  return {
    from: payload.from,
    to: payload.to,
    amount: payload.amount,
    rate: "estimated_all_inclusive_rate",
    minAmount: "dynamic_min",
    maxAmount: "dynamic_max",
    expiresInSec: 30,
  };
}

async function createSwap(payload) {
  // TODO: validate address + call provider create-swap later
  const created = await swapRepo.create({
    status: "CREATED",
    from: payload.from,
    to: payload.to,
    amount: payload.amount,
    recipientAddress: payload.recipientAddress,
  });
  return created;
}

async function getSwapById(id) {
  const swap = await swapRepo.findById(id);
  return swap;
}

module.exports = { getQuote, createSwap, getSwapById };
