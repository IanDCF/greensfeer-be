const requestController = require("../controllers/requestController");

router.route("/");
router
  .route("/:user_id")
  .post(requestController.newRequest)
  .get(requestController.getRequests)
  .delete(requestController.deleteUserAffiliation);
module.exports = router;
