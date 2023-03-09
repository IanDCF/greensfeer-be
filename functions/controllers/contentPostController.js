const { v4: uuidv4 } = require("uuid");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
const { getConnections } = require("../services/getConnections");

const db = getFirestore();

const contentPostRef = db.collection("content_post");

// POST: create new contentPost doc in 'contentPost' collection
exports.newContentPost = (req, res) => {
  const content_post_id = uuidv4();
  const author_id = req.body.user_id;
  const image = req.body.image || null;
  const video = req.body.video || null;
  const document = req.body.document || null;
  const body = req.body.body;

  const contentPostObj = {
    author_id,
    image,
    video,
    document,
    body,
    likes: 0,
    created_at: new Date().toISOString(),
  };
  contentPostRef
    .doc(`${content_post_id}`)
    .set(contentPostObj)
    .then(() => {
      return res.status(201).send({
        status: 201,
        message: `User: ${author_id} successfully shared a post`,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({ status: 500, error: `${error}` });
    });
};

// GET: all contentPosts of a single user
exports.getUserLiveFeed = async (req, res) => {
  const user_id = req.params.user_id;
  const contentPosts = [];

  try {
    // Call getConnections service to retrieve array with user ids of all connections
    const userConnections = await getConnections(user_id);

    // Query the database for all contentPosts where the author_id matches any userConnection id
    const snapshot = await contentPostRef
      .where("author_id", "in", userConnections)
      .get();

    // Loop through each contentPost and add it to the array if its author_id is in the userConnections array
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (userConnections.includes(data.author_id)) {
        contentPosts.push(data);
      }
    });

    // Return the array of content posts
    return res.status(200).send(contentPosts);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Server error" });
  }
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
