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
  const epType = req.body.p.ep_type;
  const verificationStandard = req.body.p.verification_standard;
  const methodology = req.body.p.methodology;
  const creditVolume = req.body.p.credit_volume;
  const pricePerCredit = req.body.p.price_per_credit;
  const expiryDate = req.body.p.expiry_date;
  const city = req.body.location.city;
  const stateProvince = req.body.location.state_province;
  const country = req.body.location.country;

  let subset = marketPostRef;

  if (postType) {
    subset = subset.where("post_type", "==", postType);
  }
  if (postCategory) {
    subset = subset.where("post_category", "==", postCategory);
  }
  if (epType) {
    subset = subset.where("p.ep_type", "==", epType);
  }

  if (verificationStandard) {
    subset = subset.where(
      "p.verification_standard",
      "==",
      verificationStandard
    );
  }

  if (methodology) {
    subset = subset.where("p.methodology", "==", methodology);
  }

  if (creditVolume) {
    subset = subset.where("p.credit_volume", "==", parseInt(creditVolume));
  }

  if (pricePerCredit) {
    subset = subset.where("p.price_per_credit", "==", parseInt(pricePerCredit));
  }

  if (expiryDate) {
    subset = subset.where("expiry_date", "<=", expiryDate);
  }

  if (city) {
    subset = subset.where("location.city", "==", city);
  }

  if (stateProvince) {
    subset = subset.where("location.state_province", "==", stateProvince);
  }

  if (country) {
    subset = subset.where("location.country", "==", country);
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
