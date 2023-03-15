const router = require("express").Router();
const companyController = require("../controllers/companyController");

router
  .route("/")
  .get(companyController.allCompanies)
  .post(companyController.registerCompany);
router
  .route("/:id")
  .get(companyController.singleCompany)
  .patch(companyController.updateCompany);

module.exports = router;
