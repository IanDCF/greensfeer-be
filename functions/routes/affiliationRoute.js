const router = require("express").Router();
const affiliationController = require("../controllers/affiliationController");

router.route("/").get(affiliationController.getAffilAndContact);
router.route("/new/").post(affiliationController.newUserAffiliation);
router.route("/:user_id").get(affiliationController.getUserAffiliations);
router
  .route('/delete/"user_id')
  .delete(affiliationController.deleteUserAffiliation);
module.exports = router;
