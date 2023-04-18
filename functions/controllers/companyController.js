const { v4: uuidv4 } = require("uuid");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
const db = getFirestore();
const companyRef = db.collection("company");

// POST: sent from user profile create new company
exports.registerCompany = (req, res) => {
  //get all company fields
  const { name, sector, market_role, location } = req.body.newCompany;
  const company = req.body.newCompany;
  const banner = company.banner ? company.banner : "";
  const description = company.description ? company.description : "";
  const email = company.email ? company.email : "";
  const logo = company.logo ? company.logo : "";
  const headline = company.headline ? company.headline : "";
  const website = company.website ? company.website : "";

  const company_id = uuidv4();
  const created_at = new Date().toISOString();
  //handle creation
  companyRef
    .doc(`${company_id}`)
    .set({
      name,
      sector,
      market_role,
      location,
      banner,
      company_id,
      created_at,
      description,
      email,
      logo,
      headline,
      website,
    })
    .then(() => {
      console.log(`company created: ${company_id}`);
      return res.status(200).send({
        status: 200,
        message: company_id,
      });
    })
    .catch((err) => {
      //handle error
      console.log(err);
      return res.status(500).send(err);
    });
};

// GET: list of companies from company collection
exports.allCompanies = (_req, res) => {
  companyRef
    .get()
    .then((snapshot) => {
      const companies = [];
      snapshot.forEach((doc) => {
        companies.push(doc.data());
      });
      return res.status(200).send(companies);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send(`error: Server error`);
    });
};

// GET: company whose name matches the search input
exports.searchCompany = async (req, res) => {
  const { query } = req.query;
  try {
    const snapshot = await db.collection("company").get();
    const companies = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const name = `${data.name}`;
      if (name.toLowerCase().includes(query.toLowerCase())) {
        companies.push(data);
      }
    });
    return res.status(200).send(companies);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Server error" });
  }
};

// GET: single company details
/* Any back end auth related features, or all front end?
Handle auth within this: if authorized (affiliated) return more details */
exports.singleCompany = (req, res) => {
  companyRef
    .doc(req.params.id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log(`Company ${req.params.id} requested & found`);
        return res.status(200).send(doc.data());
      } else {
        return res.status(404).send(`company not found`);
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ error: "Server error" });
    });
};

// PATCH: single company details
exports.updateCompany = (req, res) => {
  const updateObject = req.body.update;
  const company_id = req.params.id;
  console.log(req.body.update);
  companyRef
    .doc(company_id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const companyRef = db.collection("company").doc(company_id);
        return companyRef.update(updateObject);
      } else {
        return res.status(404).send({ error: "Company not found" });
      }
    })
    .then(() => {
      console.log(`Company: ${company_id} has been updated`);
      return res.status(200).send({
        status: 200,
        message: `Company: ${company_id} has been updated`,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ error: "Server error" });
    });
};
