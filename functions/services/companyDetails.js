const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const companyRef = db.collection("company");

exports.companyDetails = async (company_id) => {
  const found = await companyRef.doc(company_id);
  const docRef = await found.get();
  const company = await docRef.data();
//   console.log(company);
  return company;
};
