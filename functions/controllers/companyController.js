const admin = require("firebase-admin");
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
  const {
    name,
    email,
    website,
    logo,
    banner,
    headline,
    market_role,
    location,
    sector,
    description,
  } = req.body;
  const company_id = uuidv4();
  const created_at = new Date().toISOString();

  companyRef.doc(`${company_id}`).set({
    company_id,
    name,
    email,
    website,
    logo,
    banner,
    headline,
    market_role,
    location,
    sector,
    description,
    created_at,
  });

  //handle error
  //handle creation
};
// GET: list of companies from company collection
exports.allCompanies = (req, res) => {};

// GET: single company details
/* Any back end auth related features, or all front end?
Handle auth within this: if authorized (affiliated) return more details */
exports.singleCompany = (req, res) => {};

// PATCH: single company details
exports.updateCompany = (req, res) => {};
