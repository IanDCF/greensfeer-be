const router = require("express").Router();
const notificationController = require("../controllers/notificationController");

router.route("/:owner_id").get(notificationController.getNotifications);
router
  .route("/delete/:notification_id")
  .delete(notificationController.deleteNotification);

module.exports = router;
