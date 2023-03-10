const router = require("express").Router();
const inboxController = require("../controllers/inboxController");

router.route("/:user_id").get(inboxController.getChats);
router.route("/delete/:conversation_id").delete(inboxController.deleteChat);
router.route("/new/:user_id").post(inboxController.newChat);

module.exports = router;
