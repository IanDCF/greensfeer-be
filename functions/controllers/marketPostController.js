const { v4: uuidv4 } = require("uuid");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
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
  const ep_type = req.body.p.ep_type ? req.body.p.ep_type : "";
  const verification_standard = req.body.p.verification_standard
    ? req.body.p.verification_standard
    : "";
  const methodology = req.body.p.methodology ? req.body.p.methodology : "";
  const offset_type = req.body.p.offset_type ? req.body.p.offset_type : "";
  const offset_unit = req.body.p.offset_unit ? req.body.p.offset_unit : "";
  const credit_unit = req.body.p.credit_unit ? req.body.p.credit_unit : "";
  const credit_volume = req.body.p.credit_volume
    ? req.body.p.credit_volume
    : "";
  const price_per_credit = req.body.p.price_per_credit
    ? req.body.p.price_per_credit
    : "";
  const total_price = price_per_credit * credit_volume ? req.body.p : "";
  const vintage_year = req.body.p.vintage_year ? req.body.p.vintage_year : "";
  const modular_benefits = req.body.p.modular_benefits
    ? req.body.p.modular_benefits
    : "";
  const project_start_date = req.body.p.project_start_date
    ? req.body.p.project_start_date
    : "";
  const project_end_date = req.body.p.project_end_date
    ? req.body.p.project_end_date
    : "";
  const issuance_date = req.body.p.issuance_date
    ? req.body.p.issuance_date
    : "";
  const expiry_date = req.body.p.expiry_date ? req.body.p.expiry_date : "";
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
      ep_type,
      verification_standard,
      methodology,
      offset_type,
      offset_unit,
      credit_unit,
      credit_volume,
      price_per_credit,
      total_price,
      vintage_year,
      modular_benefits,
      project_start_date,
      project_end_date,
      issuance_date,
      expiry_date,
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

// Read => GET
// query market posts and return results
exports.queryMarketPost = async (req, res) => {
  const postType = req.body.post_type;
  const postCategory = req.body.post_category;
  /* Need some sort of short circuit on query parameters; if request is not type product it searches for undefined properties*/
  if (req.body.p) {
    const epType = req.body.p.ep_type;
    const verificationStandard = req.body.p.verification_standard;
    const methodology = req.body.p.methodology;
    const creditVolume = req.body.p.credit_volume;
    const pricePerCredit = req.body.p.price_per_credit;
    const expiryDate = req.body.p.expiry_date;
  }
  if (req.body.location) {
    const city = req.body.location.city;
    const stateProvince = req.body.location.state_province;
    const country = req.body.location.country;
  }

  let subset = marketPostRef;

  if (postType) {
    subset = subset.where("post_type", "==", postType);
  }
  if (postCategory) {
    subset = subset.where("post_category", "==", postCategory);
  }
  //   if (epType) {
  //     subset = subset.where("p.ep_type", "==", epType);
  //   }

  //   if (verificationStandard) {
  //     subset = subset.where(
  //       "p.verification_standard",
  //       "==",
  //       verificationStandard
  //     );
  //   }

  //   if (methodology) {
  //     subset = subset.where("p.methodology", "==", methodology);
  //   }

  //   if (creditVolume) {
  //     subset = subset.where("p.credit_volume", "==", parseInt(creditVolume));
  //   }

  //   if (pricePerCredit) {
  //     subset = subset.where("p.price_per_credit", "==", parseInt(pricePerCredit));
  //   }

  //   if (expiryDate) {
  //     subset = subset.where("expiry_date", "<=", expiryDate);
  //   }

  //   if (city) {
  //     subset = subset.where("location.city", "==", city);
  //   }

  //   if (stateProvince) {
  //     subset = subset.where("location.state_province", "==", stateProvince);
  //   }

  //   if (country) {
  //     subset = subset.where("location.country", "==", country);
  //   }

  const snapshot = await subset.get();
  if (snapshot.empty) {
    console.log("No matching documents.");
    return res.status(404).send();
  }

  snapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
  });
  return res.status(302).send(`hi \n ${req.body.post_type}`);
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
