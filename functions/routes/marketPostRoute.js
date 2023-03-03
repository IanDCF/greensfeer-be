const router = require("express").Router();
const userController = require("../controllers/marketPostController");

router.route("/").get(userController.allMarketPosts).post(userController.newMarketPost);
// router
//   .route("/:id")
//   .get(userController.singleMarketPost)
//   .patch(userController.updateMarketPost)
//   .delete(userController.deleteMarketPost);

module.exports = router;
