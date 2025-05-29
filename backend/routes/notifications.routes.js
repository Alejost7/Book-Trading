const router = require("express").Router();
const notificationController = require("../controllers/notifications.controller");

router.get("/notifications/:userId", notificationController.getNotifications);
router.patch("/notifications/:id/read", notificationController.markAsRead);

module.exports = router;