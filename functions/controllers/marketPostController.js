const { v4: uuidv4 } = require("uuid");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const { firstLastName } = require("../services/userFirstLastName");
const { companyDetails } = require("../services/companyDetails");

const marketPostRef = db.collection("market_post");
/* Create Marketplace posts from company page*/
/* authentication required: definitely  */

// POST: create new market post doc in ‘market_post’ collection
exports.newMarketPost = async (req, res) => {
  const {
    post_name,
    post_type,
    post_category,
    description,
    link,
    location,
    user_id,
    company_id,
    contact,
    sector,
  } = await req.body.newMarketPost;
  const p = (await req.body.newMarketPost.p) ? req.body.newMarketPost.p : null;
  const image = (await req.body.newMarketPost.image) ? image : null;

  //call service using user_id, return first name last name
  const lister_name = await firstLastName(user_id);
  //call service using company id, return company name, logo, banner
  const { company_name, logo, banner } = await companyDetails(company_id);

  const created_at = new Date().toISOString();

  const market_post_id = uuidv4();
  await marketPostRef
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
      sector,
      lister_name,
      company_name: company_name,
      logo,
      banner,
    })
    .then(() => {
      console.log(`New market post: ${market_post_id} successfully created`);
      return res.status(200).send({
        status: 200,
        message: market_post_id,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send(err);
    });
};

// GET: query market posts with URL params (filtered search)
exports.filterMarketPost = async (req, res) => {
  const post_type = req.body.post_type ? req.body.post_type : "";
  const post_category = req.body.post_category ? req.body.post_category : "";
  const ep_type = req.body.ep_type ? req.body.ep_type : "";
  const verification_standard = req.body.verification_standard
    ? req.body.verification_standard
    : "";
  const methodology = req.body.methodology ? req.body.methodology : "";
  const credit_volume = req.body.credit_volume ? req.body.credit_volume : "";
  const price_per_credit = req.body.price_per_credit
    ? req.body.price_per_credit
    : "";
  const expiry_date = req.body.expiry_date ? req.body.expiry_date : "";

  const city = req.body.city ? req.body.city : "";
  const stateProvince = req.body.state_province ? req.body.state_province : "";
  const country = req.body.country ? req.body.country : "";

  let subset = marketPostRef;

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
    subset = subset.where("p.expiry_date", "<=", expiry_date);
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

  const snapshot = await subset.get();

  if (snapshot.empty) {
    console.log("No matching documents.");
    return res.status(404).send(`${filterParams} \n ${subset}`);
  }

  const result = [];

  snapshot.forEach((doc) => {
    result.push(doc.data());
  });

  return res.status(302).send(result);
};

// GET: All market posts
exports.allMarketPosts = async (req, res) => {
  marketPostRef
    .get()
    .then((snapshot) => {
      const marketPosts = [];
      snapshot.forEach((doc) => {
        marketPosts.push(doc.data());
      });
      return res.status(200).send(marketPosts);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ error: "Server error" });
    });
};

// GET: All market posts of single company
exports.allCompanyMarketPosts = (req, res) => {
  marketPostRef
    .where("company_id", "==", req.params.company_id)
    .get()
    .then((snapshot) => {
      const marketPosts = [];
      snapshot.forEach((doc) => {
        marketPosts.push(doc.data());
      });
      return res.status(200).send(marketPosts);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ error: "Server error" });
    });
};

// GET: market post whose name matches the search input
exports.queryMarketPost = async (req, res) => {
  const { query } = req.query;
  try {
    const snapshot = await db.collection("market_post").get();
    const listings = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const name = `${data.post_name}`;
      if (name.toLowerCase().includes(query.toLowerCase())) {
        listings.push(data);
      }
    });
    return res.status(200).send(listings);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Server error" });
  }
};

// GET: a single market post
exports.getMarketPost = (req, res) => {
  const market_post_id = req.params.market_post_id;
  marketPostRef
    .doc(market_post_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(200).send({ ...doc.data() });
      } else {
        return res.status(404).send({ error: "Market Post not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ error: "Server error" });
    });
};

// PATCH: a single market post's details
exports.updateMarketPost = (req, res) => {
  const updateObject = req.body;
  const market_post_id = req.params.market_post_id;
  marketPostRef
    .doc(market_post_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const marketPostRef = db.collection("market_post").doc(market_post_id);
        return marketPostRef.update(updateObject);
      } else {
        return res.status(404).send({ error: "Market Post not found" });
      }
    })
    .then(() => {
      console.log(`Market Post: ${market_post_id} has been updated`);
      return res.status(200).send({
        status: 200,
        message: `Market Post: ${market_post_id} has been updated`,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ error: "Server error" });
    });
};

// DELETE: a single post
exports.deleteMarketPost = (req, res) => {
  const market_post_id = req.params.market_post_id;
  marketPostRef
    .doc(`${market_post_id}`)
    .delete()
    .then(() => {
      console.log(`Market Post: ${market_post_id} has been deleted`);
      return res.status(200).send({
        status: 200,
        message: `Market Post: ${market_post_id} has been deleted`,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send(err);
    });
};
