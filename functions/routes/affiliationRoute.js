const router = require("express").Router();
const affiliationController = require("../controllers/affiliationController");

router.route("/").post(affiliationController.newUserAffiliation);
router.route("/:id").get(affiliationController.getUserAffiliations);
module.exports = router;
