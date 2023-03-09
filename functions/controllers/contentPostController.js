const { v4: uuidv4 } = require("uuid");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

const db = getFirestore();

const contentPostRef = db.collection("content_post");

// POST: create new contentPost doc in 'contentPost' collection
exports.newContentPost = (req, res) => {
  const contentPost_id = uuidv4();
  const user1_id = req.body.user1_id;
  const user2_id = req.body.user2_id;
  const contentPostObj = {
    members: [user1_id, user2_id],
    created_at: new Date().toISOString(),
  };
  contentPostRef
    .doc(`${contentPost_id}`)
    .set(contentPostObj)
    .then(() => {
      return res.status(201).send({
        status: 201,
        message: `User: ${user1_id} is now a contentPost of user: ${user2_id}`,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({ status: 500, error: `${error}` });
    });
};

// GET: all contentPosts of a single user
exports.getUserContentPosts = (req, res) => {
  const user_id = req.params.user_id;
  const contentPosts = [];

  // Query the database for all contentPosts that involve the user
  contentPostRef
    .where("members", "array-contains", user_id)
    .get()
    .then((snapshot) => {
      // Loop through each contentPost and add the user's contentPost id to the array
      snapshot.forEach((doc) => {
        const contentPost = doc.data().members;
        const contentPostId = doc.id;
        const usercontentPostId = contentPost.filter((id) => id !== user_id)[0];
        contentPosts.push(usercontentPostId);
      });
      // Return the array of user's contentPost ids
      return res.status(200).send(contentPosts);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ error: "Server error" });
    });
};

// DELETE: a single contentPost doc by passing contentPost document id
exports.deleteContentPost = (req, res) => {
  const doc_id = req.params.doc_id;

  contentPostRef
    .doc(doc_id)
    .delete()
    .then(() => {
      console.log(`Document: ${doc_id} deleted successfully`);
      return res.status(200).send({
        status: 200,
        message: `Document: ${doc_id} deleted successfully`,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ error: "Server error" });
    });
};
