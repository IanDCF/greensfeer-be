const { v4: uuidv4 } = require("uuid");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
const db = getFirestore();

const marketPostRef = db.collection("market_posts");
/* Create Marketplace posts from marketplace?? */
/* authentication required  */
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
  marketPostRef
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
      return res.status(200).send(`User ${marketPostId} successfully created`);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send(err);
    });
};

// Read => GET
// Single User with ID
exports.queryMarketPost = async (req, res) => {
  const postType = req.body.post_type;
  const postCategory = req.body.post_category;
  const epType = req.body.ep_type;
  const verificationStandard = req.body.verification_standard;
  const methodology = req.body.methodology;
  const creditVolume = req.body.credit_volume;
  const pricePerCredit = req.body.price_per_credit;
  const expiryDate = req.body.expiry_date;
  const city = req.body.city;
  const stateProvince = req.body.state_province;
  const country = req.body.country;

  let subset = marketPostRef;

  if (postType) {
    subset = subset.where("post_type", "==", postType);
  }
  if (postCategory) {
    subset = subset.where("post_category", "==", postCategory);
  }

  const snapshot = await subset.get();
  if (snapshot.empty) {
    console.log("No matching documents.");
    return res.status(404).send();
  }

  snapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
  });
  return res.status(302).send();
};

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