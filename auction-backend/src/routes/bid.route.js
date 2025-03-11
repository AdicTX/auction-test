const express = require("express");
const router = express.Router();
const bidsController = require("../controllers/bids.controller");
const { authenticate } = require("../middleware/auth");

router.post("/", authenticate, bidsController.createBid);
router.get("/item/:itemId", authenticate, bidsController.getBidHistory);
router.post("/auto-bid", authenticate, bidsController.setAutoBid);

module.exports = router;
