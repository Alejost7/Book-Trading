const router = require("express").Router();
const donationsController = require('../controllers/donations.controller')

router.post('/donate', donationsController.donateBook);
router.get('/donations', donationsController.getDonatedBooks);

module.exports = router;