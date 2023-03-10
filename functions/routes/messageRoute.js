const router = require("express").Router();
const messageController = require("../controllers/messageController");

router
  .route("/:conversation_id")
  .get(messageController.getMessages)
  .post(messageController.newMessage);
router.route("/edit/:message_id").patch(messageController.editMessage);
router.route("/delete/:message_id").delete(messageController.deleteMessage);

module.exports = router;
