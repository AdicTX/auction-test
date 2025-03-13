const express = require("express");
const router = express.Router();
const bidsController = require("../controllers/bids.controller");
const { authenticate } = require("../middleware/auth");

router.post("/", authenticate, bidsController.createBid);
router.get("/item/:itemId", authenticate, bidsController.getBidHistory);

router.get("/auto-bid/global-config", authenticate, bidsController.getGlobalConfig);
router.post("/auto-bid/global-config", authenticate, bidsController.updateGlobalConfig);

router.put("/auto-bid/toggle/:itemId", authenticate, bidsController.toggleAutoBid);

router.get("/auto-bid/usage", authenticate, bidsController.getUsage);
router.get("/auto-bid/status/:itemId", authenticate, bidsController.getAutoBidStatus);
module.exports = router;
