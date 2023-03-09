const { v4: uuidv4 } = require("uuid");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const db = getFirestore();

const commentRef = db.collection("comment");

// GET: all comments for particular content_post_id
exports.getPostComments = (req, res) => {
  console.log(req.body);
};

// POST: new comment associated with content_post_id
exports.newComment = (req, res) => {
  console.log(req.body);
};

// PATCH: **Future feature: update a certain comment by comment_id

// DELETE: **Future feature: delete a certain comment by comment_id
