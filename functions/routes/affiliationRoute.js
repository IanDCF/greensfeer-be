const router = require("express").Router();
const affiliationController = require("../controllers/affiliationController");

router.route("/").post(affiliationController.newUserAffiliation);

module.exports = router;
