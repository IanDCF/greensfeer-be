const router = require("express").Router();
// const { user } = require("firebase-functions/v1/auth");
const companyController = require("../controllers/companyController");

router.route("/register").post(companyController.registerCompany);
router.route("/").get(companyController.allCompanies);
router
  .route("/:id")
  .get(companyController.singleCompany)
  .patch(companyController.updateCompany);

module.exports = router;
