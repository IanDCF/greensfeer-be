const router = require("express").Router();
const affiliationController = require("../controllers/affiliationController");

router.route("/").post(affiliationController.newUserAffiliation);
router
  .route("/:user_id")
  .get(affiliationController.getUserAffiliations)
  .delete(affiliationController.deleteUserAffiliation);
module.exports = router;
