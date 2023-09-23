const { v4: uuidv4 } = require("uuid");
const { getFirestore } = require("firebase-admin/firestore");
const { getConnections } = require("../services/getConnections");

const db = getFirestore();

const contentPostRef = db.collection("content_post");

// POST: create new contentPost doc in 'contentPost' collection
exports.newContentPost = (req, res) => {
  const content_post_id = uuidv4();
  const author_id = req.body.author_id;
  const image = req.body.image || null;
  const video = req.body.video || null;
  const document = req.body.document || null;
  const body = req.body.body;

  const contentPostObj = {
    content_post_id,
    author_id,
    image,
    video,
    document,
    body,
    likes: [],
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

// GET: all content posts of a user's connections
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

// GET: all content posts in db
exports.getContentPosts = (req, res) => {
  contentPostRef
    .get()
    .then((snapshot) => {
      const contentPosts = [];
      snapshot.forEach((doc) => {
        contentPosts.push(doc.data());
      });
      return res.status(200).send(contentPosts);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ error: "Server error" });
    });
};

// GET: all content posts of a single user
exports.getUserContentPosts = (req, res) => {
  const author_id = req.params.author_id;
  contentPostRef
    .where("author_id", "==", author_id)
    .get()
    .then((snapshot) => {
      const contentPosts = snapshot.docs.map((doc) => doc.data());
      return res.status(200).send(contentPosts);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ error: "Server error" });
    });
};

// PATCH: a single content post doc by passing content_post_id in params
exports.editContentPost = (req, res) => {
  const doc_id = req.params.post_id;
  const author_id = req.body.author_id;
  const image = req.body.image || null;
  const video = req.body.video || null;
  const document = req.body.document || null;
  const body = req.body.body;

  const updateObj = {
    image,
    video,
    document,
    body,
  };

  contentPostRef
    .doc(doc_id)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).send({ error: "Document not found" });
      }
      const data = doc.data();
      if (data.author_id !== author_id) {
        return res.status(403).send({ error: "Unauthorized to edit document" });
      }
      return contentPostRef.doc(doc_id).update(updateObj);
    })
    .then(() => {
      console.log(`Document: ${doc_id} updated successfully`);
      return res.status(200).send({
        status: 200,
        message: `Document: ${doc_id} updated successfully`,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ error: "Server error" });
    });
};

// PATCH: update likes of content post
exports.likeContentPost = (req, res) => {
  const doc_id = req.params.post_id;
  const user_id = req.body.user_id;

  contentPostRef
    .doc(doc_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        const likes = data.likes || [];

        if (!likes.includes(user_id)) {
          likes.push(user_id);

          contentPostRef
            .doc(doc_id)
            .update({ likes: likes })
            .then(() => {
              return res.status(200).send({ status: 200, likes: likes.length });
            })
            .catch((err) => {
              console.error(err);
              return res.status(500).send({ error: "Server error" });
            });
        } else {
          return res.status(400).send({ error: "User already liked the post" });
        }
      } else {
        return res.status(404).send({ error: "Post not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ error: "Server error" });
    });
};

// DELETE: a single content post by passing content_post_id in params
// ensures that actor is authorized to delete
exports.deleteContentPost = (req, res) => {
  const doc_id = req.params.post_id;
  const author_id = req.body.author_id;

  contentPostRef
    .doc(doc_id)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).send({
          error: "Content post not found",
        });
      }

      const data = doc.data();

      if (data.author_id !== author_id) {
        return res.status(403).send({
          error: "Unauthorized to delete content post",
        });
      }

      return contentPostRef
        .doc(doc_id)
        .delete()
        .then(() => {
          console.log(`Document: ${doc_id} deleted successfully`);
          return res.status(200).send({
            status: 200,
            message: `Document: ${doc_id} deleted successfully`,
          });
        });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ error: "Server error" });
    });
};
