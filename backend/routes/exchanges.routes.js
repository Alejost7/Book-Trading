const router = require("express").Router();
const exchangeController = require('../controllers/exchanges.controller');

router.post('/createExchange', exchangeController.createExchange);
router.patch('/updateExchange/:id', exchangeController.updateExchangeStatus);
router.post('/exchangeDonation', exchangeController.exchangeDonation);
router.post("/exchan/:id/details", exchangeController.exchangeDetails);
router.get("/exchangesUser", exchangeController.getExchanges);
router.patch("/:id/confirm-delivery", exchangeController.confirmDeliveryBook);

module.exports = router;