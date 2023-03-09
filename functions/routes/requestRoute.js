const router = require("express").Router();
const requestController = require("../controllers/requestController");

router.route("/handle/:request_id").patch(requestController.handleRequest);
router.route("/delete/:request_id").delete(requestController.deleteRequest);
router.route("/send/:addressee_id").post(requestController.newRequest);
router.route("/:user_id").get(requestController.getRequests);

module.exports = router;
