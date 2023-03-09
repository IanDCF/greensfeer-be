const router = require("express").Router();
const contentPostController = require("../controllers/contentPostController");

router.route("/").post(contentPostController.newContentPost);
router.route("/:user_id").get(contentPostController.getUserContentPosts);
router.route("/delete/:doc_id").delete(contentPostController.deleteContentPost);
module.exports = router;
