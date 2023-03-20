const router = require("express").Router();
const userController = require("../controllers/userController");

router.route("/create").post(userController.createUser);
router.route("/").get(userController.allUsers);
router
  .route("/:id")
  .get(userController.singleUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
