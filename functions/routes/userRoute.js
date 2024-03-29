const router = require("express").Router();
const userController = require("../controllers/userController");

router.route("/create").patch(userController.createUser);
router.route("/").get(userController.allUsers);
router.route("/search").get(userController.searchUsers);
router.route("/current").get(userController.currentUser);
router
  .route("/:id")
  .get(userController.singleUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
router.route("/signUp").post(userController.entryForSignUp);

module.exports = router;
