const swapRepo = require("../repositories/swap.repo");
const swapEventRepo = require("../repositories/swapEvent.repo");

const STATUS_FLOW = ["SELECT", "CONFIRM", "SEND", "FUNDS_RECEIVED", "SWAPPING", "COMPLETED"];

function canMove(from, to) {
  // allow terminal moves too
  if (["FAILED", "EXPIRED", "COMPLETED"].includes(from)) return false;
  if (["FAILED", "EXPIRED"].includes(to)) return true;

  const fromIdx = STATUS_FLOW.indexOf(from);
  const toIdx = STATUS_FLOW.indexOf(to);
  return fromIdx !== -1 && toIdx !== -1 && toIdx >= fromIdx; // no backwards
}

class SwapStatusService {
  async changeStatus(publicId, nextStatus, meta = {}) {
    const swap = await swapRepo.findByPublicId(publicId);
    if (!swap) {
      const err = new Error("Swap not found");
      err.status = 404;
      err.code = "SWAP_NOT_FOUND";
      throw err;
    }

    if (!canMove(swap.status, nextStatus)) {
      const err = new Error(`Invalid status transition: ${swap.status} → ${nextStatus}`);
      err.status = 400;
      err.code = "INVALID_STATUS_TRANSITION";
      throw err;
    }

    const updated = await swapRepo.updateByPublicId(publicId, { status: nextStatus });

    await swapEventRepo.create({
      swapPublicId: publicId,
      type: "STATUS_CHANGED",
      data: { from: swap.status, to: nextStatus, ...meta },
    });

    return updated;
  }

  async addEvent(publicId, type, data = {}) {
    return swapEventRepo.create({ swapPublicId: publicId, type, data });
  }

  async setRecipientAddress(publicId, recipientAddress) {
    const updated = await swapRepo.updateByPublicId(publicId, { recipientAddress });

    await swapEventRepo.create({
      swapPublicId: publicId,
      type: "ADDRESS_SET",
      data: { recipientAddress },
    });

    return updated;
  }

  async createDepositAddress(publicId, deposit) {
    // deposit = { address, chain, expiresAt, qr? }
    const updated = await swapRepo.updateByPublicId(publicId, { deposit });

    await swapEventRepo.create({
      swapPublicId: publicId,
      type: "DEPOSIT_ADDRESS_CREATED",
      data: deposit,
    });

    return updated;
  }

  async markDepositDetected(publicId, { txHash, receivedAt = new Date() }) {
    const swap = await swapRepo.findByPublicId(publicId);
    if (!swap) {
      const err = new Error("Swap not found");
      err.status = 404;
      err.code = "SWAP_NOT_FOUND";
      throw err;
    }

    const deposit = {
      ...(swap.deposit || {}),
      txHash,
      receivedAt,
    };

    const updated = await swapRepo.updateByPublicId(publicId, { deposit });

    await swapEventRepo.create({
      swapPublicId: publicId,
      type: "DEPOSIT_DETECTED",
      data: { txHash, receivedAt },
    });

    // auto move: SEND -> FUNDS_RECEIVED
    if (swap.status === "SEND") {
      await this.changeStatus(publicId, "FUNDS_RECEIVED", { reason: "deposit_detected" });
    }

    return updated;
  }
}

module.exports = new SwapStatusService();
