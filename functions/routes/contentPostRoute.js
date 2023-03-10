const router = require("express").Router();
const contentPostController = require("../controllers/contentPostController");

router
  .route("/")
  .post(contentPostController.newContentPost)
  .get(contentPostController.getContentPosts);
router.route("/:user_id").get(contentPostController.getUserContentPosts);
router.route("/live_feed/:user_id").get(contentPostController.getUserLiveFeed);
router.route("/edit/:post_id").patch(contentPostController.editContentPost);
router.route("/like/:post_id").patch(contentPostController.likeContentPost);
router
  .route("/delete/:post_id")
  .delete(contentPostController.deleteContentPost);
module.exports = router;
