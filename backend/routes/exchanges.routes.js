const router = require("express").Router();
const exchangeController = require('../controllers/exchanges.controller');

router.post('exchange', exchangeController.createExchange);
router.patch('/exchanges/:id', exchangeController.updateExchangeStatus);
router.post('/exchangeDonation', exchangeController.exchangeDonation);
router.post("/exchanges/:id/details", exchangeController.exchangeDetails);
router.get("/exchangesUser", exchangeController.getExchanges);

module.exports = router;