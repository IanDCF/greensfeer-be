const router = require("express").Router();
const connectionController = require("../controllers/connectionController");

router.route("/").post(connectionController.newConnection);
router.route("/:user_id").get(connectionController.getUserConnections);
router
  .route("/delete/:connection_id")
  .delete(connectionController.deleteConnection);
module.exports = router;
