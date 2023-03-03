const { v4: uuidv4 } = require("uuid");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
const db = getFirestore();

/* Create Marketplace posts from marketplace?? */
// Create => POST
exports.newMarketPost = (req, res) => {
  const {
    city,
    country,
    description,
    ep_type,
    modular_benefits,
    name,
    post_category,
    post_type,
    source_link,
    user_id,
  } = req.body;
  const marketPostId = uuidv4();
  db.collection("market_posts")
    .doc(`${marketPostId}`)
    .set({
      city,
      country,
      description,
      ep_type,
      modular_benefits,
      name,
      post_category,
      post_type,
      source_link,
      user_id,
    })
    .then(() => {
      console.log(`User ${marketPostId} successfully created`);
      return res.status(200).send();
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send(err);
    });
};

// Read => GET
// Single User with ID
// exports.singleUser = (req, res) => {
//   db.collection("user")
//     .doc(req.params.id)
//     .get()
//     .then((doc) => {
//       if (doc.exists) {
//         console.log(`User ${req.params.id} was found`);
//         return res.status(200).send(doc.data());
//       } else {
//         return res.status(404).send({ error: "User not found" });
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//       return res.status(500).send({ error: "Server error" });
//     });
// };

// All users
exports.allMarketPosts = async (req, res) => {
  try {
    const snapshot = await db.collection("market_posts").get();
    const marketPosts = [];
    snapshot.forEach((doc) => {
      marketPosts.push(doc.data());
    });
    return res.status(200).send(users);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Server error" });
  }
};

// Update => PATCH
exports.updateUser = (req, res) => {
  const updateObject = req.body;
  db.collection("user")
    .doc(req.params.id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const userRef = db.collection("user").doc(req.params.id);
        return userRef.update(updateObject);
      } else {
        return res.status(404).send({ error: "User not found" });
      }
    })
    .then(() => {
      console.log(`User ${req.params.id} has been updated`);
      return res.status(200).send(`User ${req.params.id} has been updated`);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ error: "Server error" });
    });
};

// Delete
// Single User with ID
exports.deleteUser = (req, res) => {
  db.collection("user")
    .doc(`${req.params.id}`)
    .delete()
    .then(() => {
      console.log(`User ${req.params.id} has been deleted`);
      return res.status(200).send(`User ${req.params.id} has been deleted`);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send(err);
    });
};
