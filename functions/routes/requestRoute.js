const router = require("express").Router();
const requestController = require("../controllers/requestController");

router
  .route("/:user_id")
  .post(requestController.newRequest)
  .get(requestController.getRequests)
  .patch(requestController.handleRequest)
  .delete(requestController.deleteRequest);
module.exports = router;
