const router = require("express").Router();
const marketPostController = require("../controllers/marketPostController");

router
  .route("/")
  .get(marketPostController.allMarketPosts)
  .post(marketPostController.newMarketPost);
// router
//   .route("/:id")
//   .get(marketPostController.singleMarketPost)
//   .patch(marketPostController.updateMarketPost)
//   .delete(marketPostController.deleteMarketPost);
router.route("/query").get(marketPostController.queryMarketPost);
module.exports = router;
