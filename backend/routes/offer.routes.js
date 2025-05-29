const router = require("express").Router();
const offerController = require("../controllers/offer.controller");

router.patch("/books/:id/offer", offerController.offerBook);
router.patch("/books/:id/unoffer", offerController.unofferBook);

module.exports = router;