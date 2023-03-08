const router = require("express").Router();
const marketPostController = require("../controllers/marketPostController");

router
  .route("/")
  .get(marketPostController.allMarketPosts)
  .post(marketPostController.newMarketPost);
router
  .route("/:market_post_id")
  .get(marketPostController.getMarketPost)
  .patch(marketPostController.updateMarketPost)
  .delete(marketPostController.deleteMarketPost);
router.route("/query/search").get(marketPostController.queryMarketPost);
router
  .route("/company/:company_id")
  .get(marketPostController.allCompanyMarketPosts);

module.exports = router;
