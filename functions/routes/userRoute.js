const router = require("express").Router();
const { user } = require("firebase-functions/v1/auth");
const userController = require("../controllers/userController");

router.route("/register").post(userController.registerUser);
router.route("/login").post(userController.loginUser);
router.route("/").get(userController.allUsers);
router
  .route("/:id")
  .get(userController.singleUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
