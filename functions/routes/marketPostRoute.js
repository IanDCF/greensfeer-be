const router = require("express").Router();
const marketPostController = require("../controllers/marketPostController");

router
  .route("/")
  .get(marketPostController.allMarketPosts)
  .post(marketPostController.newMarketPost);
router.route("/query").get(marketPostController.queryMarketPost);
//   .patch(marketPostController.updateMarketPost)
//   .delete(marketPostController.deleteMarketPost);
router.route("/:company_id").get(marketPostController.allCompanyMarketPosts);

module.exports = router;
