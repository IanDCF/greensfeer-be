const router = require("express").Router();
const contentPostController = require("../controllers/contentPostController");

router
  .route("/")
  .post(contentPostController.newContentPost)
  .get(contentPostController.getContentPosts);
router.route("/:user_id").get(contentPostController.getUserLiveFeed);
router.route("/edit/:post_id").patch(contentPostController.editContentPost);
router
  .route("/delete/:post_id")
  .delete(contentPostController.deleteContentPost);
module.exports = router;
