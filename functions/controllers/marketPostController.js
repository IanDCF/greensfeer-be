const { v4: uuidv4 } = require("uuid");

const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
const { query } = require("express");
const db = getFirestore();

const marketPostRef = db.collection("market_post");
/* Create Marketplace posts from company page*/
/* authentication required: definitely  */

// POST: create new market post doc in ‘market_post’ collection
exports.newMarketPost = (req, res) => {
  const user_id = req.body.user_id;
  const company_id = req.body.company_id;
  const image = req.body.image;
  const post_name = req.body.post_name;
  const post_type = req.body.post_type;
  const post_category = req.body.post_category;
  const description = req.body.description;
  const p = req.body.p;
  const link = req.body.link;
  const location = req.body.location;
  const contact = req.body.contact;
  const created_at = req.body.created_at;

  const market_post_id = uuidv4();
  marketPostRef
    .doc(`${market_post_id}`)
    .set({
      market_post_id,
      user_id,
      company_id,
      image,
      post_name,
      post_type,
      post_category,
      description,
      p,
      link,
      location,
      contact,
      created_at,
    })
    .then(() => {
      console.log(`New market post: ${market_post_id} successfully created`);
      return res
        .status(200)
        .send(`New market post: ${market_post_id} successfully created`);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send(err);
    });
};

// GET: query market posts with URL params (filtered search)
exports.queryMarketPost = async (req, res) => {
  const post_type = req.body.post_type ? req.body.post_type : "";
  const post_category = req.body.post_category ? req.body.post_category : "";
  const ep_type = req.body.p ? req.body.p.ep_type : "";
  const verification_standard = req.body.p
    ? req.body.p.verification_standard
    : "";
  const methodology = req.body.p ? req.body.p.methodology : "";
  const credit_volume = req.body.p ? req.body.p.credit_volume : "";
  const price_per_credit = req.body.p ? req.body.p.price_per_credit : "";
  const expiry_date = req.body.p ? req.body.p.expiry_date : "";

  const city = req.body.location ? req.body.location.city : "";
  const stateProvince = req.body.location
    ? req.body.location.state_province
    : "";
  const country = req.body.location ? req.body.location.country : "";

  let subset = marketPostRef;

  // const queryArray = [];

  if (post_type !== "") {
    subset = subset.where("post_type", "==", post_type);
  }
  if (post_category !== "") {
    subset = subset.where("post_category", "==", post_category);
  }
  if (ep_type !== "") {
    subset = subset.where("p.ep_type", "==", ep_type);
  }

  if (verification_standard !== "") {
    subset = subset.where(
      "p.verification_standard",
      "==",
      verification_standard
    );
  }

  if (methodology !== "") {
    subset = subset.where("p.methodology", "==", methodology);
  }

  if (credit_volume !== "") {
    subset = subset.where("p.credit_volume", "==", parseInt(credit_volume));
  }

  if (price_per_credit !== "") {
    subset = subset.where(
      "p.price_per_credit",
      "==",
      parseInt(price_per_credit)
    );
  }

  if (expiry_date !== "") {
    subset = subset.where("expiry_date", "<=", expiry_date);
  }

  if (city !== "") {
    subset = subset.where("location.city", "==", city);
  }

  if (stateProvince !== "") {
    subset = subset.where("location.state_province", "==", stateProvince);
  }

  if (country !== "") {
    subset = subset.where("location.country", "==", country);
  }

  // if (queryArray.length > 0) {
  //   const queryRefs = queryArray.map((query) => query.get());
  //   const queryDocs = await Promise.all(queryRefs);
  //   const docIds = queryDocs.map((doc) => doc.id);
  //   subset = subset.where(db.FieldPath.documentId(), "in", docIds);
  // }

  const snapshot = await subset.get();

  if (snapshot.empty) {
    console.log("No matching documents.");
    return res.status(404).send();
  }

  const result = [];

  snapshot.forEach((doc) => {
    result.push(doc.data());
  });

  return res.status(302).send(result);
};

// GET: All market posts of a single company
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
