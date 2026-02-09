const express = require("express");
const router = express.Router();

const swapsController = require("../../../controllers/swap.controller");

// Create swap draft
router.post("/", swapsController.createSwap);

// Confirm step: set recipient address + move to CONFIRM
router.patch("/:publicId/confirm", swapsController.confirmSwap);

// Send step: create deposit + move to SEND
router.patch("/:publicId/send", swapsController.startSendStep);

// Deposit detected (for testing now)
router.patch("/:publicId/deposit-detected", swapsController.markDepositDetected);

// Get swap + events
router.get("/:publicId", swapsController.getSwap);
router.get("/:publicId/events", swapsController.getSwapEvents);

module.exports = router;
