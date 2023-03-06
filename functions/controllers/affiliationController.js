const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

const db = getFirestore();

const affiliationRef = db.collection("affiliation");

// Post new user doc in 'affiliation' collection
exports.newUserAffiliation = (req, res) => {
  const userId = req.body.user_id;
  const affObject = {
    company_id: req.body.company_id,
    admin: req.body.admin,
    posting: req.body.posting,
  };
  affiliationRef
    .doc(userId)
    .set(affObject)
    .then(() => {
      return res.status(201).send({
        status: 201,
        message: `User: ${userId} has been affiliated with company: ${affObject.company_id}`,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({ status: 500, error: `${error}` });
    });
};
