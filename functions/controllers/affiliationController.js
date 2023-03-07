const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

const db = getFirestore();

const affiliationRef = db.collection("affiliation");

// POST: new user doc in 'affiliation' collection
exports.newUserAffiliation = (req, res) => {
  const user_id = req.body.user_id;
  const company_id = req.body.company_id;
  const affObject = {
    [user_id]: {
      user_id,
      company_id,
      admin: req.body.admin,
      posting: req.body.posting,
    },
  };
  affiliationRef
    .doc(`${company_id}`)
    .set(affObject)
    .then(() => {
      return res.status(201).send({
        status: 201,
        message: `User: ${user_id} has been affiliated with company: ${company_id}`,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({ status: 500, error: `${error}` });
    });
};

exports.getUserAffiliations = (req, res) => {
  const user_id = req.body.user_id;
  const query = db.collection("affiliation").where(`${user_id}`, "!=", null);

  query
    .get()
    .then((querySnapshot) => {
      const result = [];
      querySnapshot.forEach((doc) => {
        result.push(doc.data());
      });
      return res.status(201).send(result);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({ status: 500, error: `${error}` });
    });
};
