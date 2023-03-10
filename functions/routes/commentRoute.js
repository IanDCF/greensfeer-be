const router = require("express").Router();
const commentController = require("../controllers/commentController");

router
  .route("/:content_post_id")
  .get(commentController.getPostComments)
  .post(commentController.newComment);
router
  .route("/comment_id")
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);

module.exports = router;
