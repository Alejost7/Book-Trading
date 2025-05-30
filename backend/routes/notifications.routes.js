const express = require('express');
const router = express.Router();
const notificationController = require("../controllers/notifications.controller");

router.get("/notifications/:userId", notificationController.getNotifications);
router.patch("/notifications/:id/read", notificationController.markAsRead);
router.delete("/:userId/all", notificationController.deleteAllNotifications);

module.exports = router;