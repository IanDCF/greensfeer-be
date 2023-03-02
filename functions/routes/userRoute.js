const router = require("express").Router();
const userController = require("../controllers/userController");

// router.route("/").get(userController.allUsers).post(userController.newUser);
// router
//   .route("/:id")
//   .get(userController.singleUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

router.route('/').get(userController.test)

module.exports = router;
