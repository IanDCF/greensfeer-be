const { v4: uuidv4 } = require("uuid");
const {
  getFirestore,
  Timestamp,
  FieldValue,
  FieldPath,
} = require("firebase-admin/firestore");
const db = getFirestore();

const marketPostRef = db.collection("market_posts");
/* Create Marketplace posts from marketplace?? */
/* authentication required  */
// Create => POST
exports.newMarketPost = (req, res) => {
  const user_id = req.body.user_id;
  const company_id = req.body.company_id;
  const description = req.body.description;

  const city = req.body.location.city;
  const country = req.body.location.country;
  const post_type = req.body.post_type;
  const post_category = req.body.post_category;
  const ep_type = req.body.p.ep_type;
  const verification_standard = req.body.p.verification_standard;
  const methodology = req.body.p.methodology;
  const credit_volume = req.body.p.credit_volume;
  const price_per_credit = req.body.p.price_per_credit;
  const expiry_date = req.body.p.expiry_date;
  const state_province = req.body.location.state_province;

  const marketPostId = uuidv4();
  marketPostRef
    .doc(`${marketPostId}`)
    .set({
      city,
      country,
      description,
      ep_type,
      post_category,
      post_type,
      user_id,
      verification_standard,
      methodology,
      credit_volume,
      price_per_credit,
      expiry_date,
      state_province,
      company_id,
    })
    .then(() => {
      console.log(`Post ${marketPostId} successfully created`);
      return res.status(200).send(`Post ${marketPostId} successfully created`);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send(err);
    });
};

// Read => GET
// query market posts and return results
exports.queryMarketPost = async (req, res) => {
  const filterParams = req.body;
  let subset = marketPostRef;
  const queryKeys = [];
  const queryValues = [];

  for (const property in filterParams) {
    queryKeys.push(new FieldPath(property));
    queryValues.push(filterParams[property]);
  }
  console.log(queryKeys[0]);

  // .where's field to filter on apparently *must* be format "field_name". template literals and variables will not work
  const snapshot = await subset.where(queryKeys[0], "==", queryValues[0]).get();
  if (snapshot.empty) {
    console.log("No matching documents.");
    return res.status(404).send(`${filterParams} \n ${subset}`);
  }
  filteredPosts = [];
  snapshot.forEach((doc) => {
    filteredPosts.push(doc.data());
  });
  return res.status(302).send(filteredPosts);
};

// All users
exports.allMarketPosts = async (req, res) => {
  try {
    const snapshot = await db.collection("market_posts").get();
    const marketPosts = [];
    snapshot.forEach((doc) => {
      marketPosts.push(doc.data());
    });
    return res.status(200).send(marketPosts);
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
