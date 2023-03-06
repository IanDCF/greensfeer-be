const admin = require("firebase-admin");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
const db = getFirestore();

// POST: sent from user profile create new company
exports.registerCompany = (req, res) => {
  //get all company fields
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
