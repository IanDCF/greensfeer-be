const { v4: uuidv4 } = require("uuid");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

const commentRef = db.collection("comment");

// GET: all comments for particular content_post_id
exports.getPostComments = async (req, res) => {
  content_post_id = req.params.content_post_id;
  const snapshot = await commentRef
    .where("content_post_id", "==", content_post_id)
    .get();
  if (snapshot.empty) {
    console.log(`no comments on post ${content_post_id}`);
    return res.status(204).send({
      status: 204,
      message: `no comments on post ${content_post_id}`,
    });
  }
  const result = snapshot.docs.map((doc) => doc.data());
  return res.status(200).send(result);
};

// POST: new comment associated with content_post_id
exports.newComment = (req, res) => {
  const comment_id = uuidv4();
  content_post_id = req.params.content_post_id;
  const { author_id, text } = req.body;
  timestamp = new Date().toISOString();

  const commentObj = {
    comment_id,
    content_post_id,
    author_id,
    text,
    created_at: timestamp,
    updated_at: timestamp,
  };

  commentRef
    .doc(comment_id)
    .set(commentObj)
    .then(() => {
      return res.status(201).send({
        status: 201,
        message: `comment ${comment_id} created on ${content_post_id}`,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({ status: 500, error: `${error}` });
    });
};

// PATCH: **Future feature: update a certain comment by comment_id
exports.updateComment = (req, res) => {
  console.log("future feature");
};
// DELETE: **Future feature: delete a certain comment by comment_id
exports.deleteComment = (req, res) => {
  console.log("future feature");
};
