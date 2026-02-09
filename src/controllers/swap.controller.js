const swapRepo = require("../repositories/swap.repo");
const swapEventRepo = require("../repositories/swapEvent.repo");
const swapStatusService = require("../services/swapStatus.service");
const { newPublicId } = require("../utils/id");

/**
 * POST /v1/swaps
 * Create swap draft (SELECT)
 */
async function createSwap(req, res, next) {
  try {
    const { from, to } = req.body;

    const swap = await swapRepo.create({
      publicId: newPublicId("swp"),
      from,
      to,
      status: "SELECT",
    });

    await swapStatusService.addEvent(swap.publicId, "STATUS_CHANGED", {
      from: null,
      to: "SELECT",
      created: true,
    });

    res.status(201).json({ data: swap });
  } catch (e) {
    next(e);
  }
}

/**
 * PATCH /v1/swaps/:publicId/confirm
 * Set recipient address + move to CONFIRM
 */
async function confirmSwap(req, res, next) {
  try {
    const { publicId } = req.params;
    const { recipientAddress } = req.body;

    await swapStatusService.setRecipientAddress(publicId, recipientAddress);
    const updated = await swapStatusService.changeStatus(publicId, "CONFIRM");

    res.json({ data: updated });
  } catch (e) {
    next(e);
  }
}

/**
 * PATCH /v1/swaps/:publicId/send
 * Create deposit address (placeholder logic) + move to SEND
 */
async function startSendStep(req, res, next) {
  try {
    const { publicId } = req.params;

    // TODO: replace with real deposit address creation logic (wallet service)
    const deposit = {
      address: "0xDEMO_DEPOSIT_ADDRESS",
      chain: "ethereum",
      qr: null,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 min
      receivedAt: null,
      txHash: null,
    };

    await swapStatusService.createDepositAddress(publicId, deposit);
    const updated = await swapStatusService.changeStatus(publicId, "SEND");

    res.json({ data: updated });
  } catch (e) {
    next(e);
  }
}

/**
 * PATCH /v1/swaps/:publicId/deposit-detected
 * Mark deposit detected + auto-move to FUNDS_RECEIVED
 */
async function markDepositDetected(req, res, next) {
  try {
    const { publicId } = req.params;
    const { txHash } = req.body;

    const updated = await swapStatusService.markDepositDetected(publicId, { txHash });
    res.json({ data: updated });
  } catch (e) {
    next(e);
  }
}

/**
 * GET /v1/swaps/:publicId
 */
async function getSwap(req, res, next) {
  try {
    const { publicId } = req.params;
    const swap = await swapRepo.findByPublicId(publicId);
    if (!swap) return res.status(404).json({ error: { code: "SWAP_NOT_FOUND", message: "Swap not found" } });
    res.json({ data: swap });
  } catch (e) {
    next(e);
  }
}

/**
 * GET /v1/swaps/:publicId/events
 */
async function getSwapEvents(req, res, next) {
  try {
    const { publicId } = req.params;
    const events = await swapEventRepo.listBySwapPublicId(publicId, 50);
    res.json({ data: events });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  createSwap,
  confirmSwap,
  startSendStep,
  markDepositDetected,
  getSwap,
  getSwapEvents,
};
