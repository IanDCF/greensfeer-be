const { v4: uuidv4 } = require("uuid");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
const db = getFirestore();


const marketPostRef = db.collection("market_post");
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
exports.queryMarketPost = (req, res) => {
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

  // Add filters to the query based on the provided parameters
  if (postType) {
    query = marketPostRef.where("post_type", "==", postType);
  }

  if (postCategory) {
    query = marketPostRef.where("post_category", "==", postCategory);
  }

  if (epType) {
    query = marketPostRef.where("p.ep_type", "==", epType);
  }

  if (verificationStandard) {
    query = marketPostRef.where(
      "p.verification_standard",
      "==",
      verificationStandard
    );
  }

  if (methodology) {
    query = marketPostRef.where("p.methodology", "==", methodology);
  }

  if (creditVolume) {
    query = marketPostRef.where(
      "p.credit_volume",
      "==",
      parseInt(creditVolume)
    );
  }

  if (pricePerCredit) {
    query = marketPostRef.where(
      "p.price_per_credit",
      "==",
      parseInt(pricePerCredit)
    );
  }

  if (expiryDate) {
    query = marketPostRef.where("expiry_date", "<=", expiryDate);
  }

  if (city) {
    query = marketPostRef.where("location.city", "==", city);
  }

  if (stateProvince) {
    query = marketPostRef.where("location.state_province", "==", stateProvince);
  }

  if (country) {
    query = marketPostRef.where("location.country", "==", country);
  }

  // Execute the query
  marketPostRef
    .get()
    .then((querySnapshot) => {
      const results = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        const data = doc.data();
        results.push(data);
      });
      res.status(200).json(results);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error fetching market posts");
    });
};

// All users
exports.exports.allMarketPosts = async (req, res) => {
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
