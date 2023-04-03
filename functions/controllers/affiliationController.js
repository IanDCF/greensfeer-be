const { v4: uuidv4 } = require("uuid");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");

const db = getFirestore();

const affiliationRef = db.collection("affiliation");

// POST: new affiliation doc in 'affiliation' collection
exports.newUserAffiliation = (req, res) => {
  const affiliation_id = uuidv4();
  const { user_id, company_id, admin, posting } = req.body;

  const created_at = Timestamp.now()
  const affObject = {
    affiliation_id,
    user_id,
    company_id,
    admin,
    posting,
    created_at,
  };
  console.log(affObject)
  affiliationRef
    .doc(`${affiliation_id}`)
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

// GET:
exports.getAffilAndContact = async (req, res) => {
  idToken = req.headers.token;
  const decoded = await getAuth().verifyIdToken(idToken);
  const subset = await affiliationRef.where("user_id", "==", decoded.uid).get();
  const company_id = subset.docs[0].data().company_id;
  console.log(subset.docs);
  const response = { user_id: decoded.uid, company_id };
  return res.status(200).send({
    status: 200,
    message: response,
  });
};

// GET: all affiliated companies of a single user
exports.getUserAffiliations = async (req, res) => {
  const user_id = req.params.user_id ?? "";

  const subset = affiliationRef.where("user_id", "==", user_id);

  const snapshot = await subset.get();

  if (snapshot.size === 0) {
    console.log(`No affiliations found for user: ${user_id}`);
    return res.status(404).send({
      status: 404,
      error: `No affiliations found for user: ${user_id}`,
    });
  }

  const result = snapshot.docs.map((doc) => doc.data());

  return res.status(302).send(result);
};

// DELETE: a single affiliation doc
exports.deleteUserAffiliation = async (req, res) => {
  const user_id = req.params.user_id ?? "";
  const company_id = req.body.company_id ?? "";

  const subset = affiliationRef
    .where("user_id", "==", user_id)
    .where("company_id", "==", company_id);

  const snapshot = await subset.get();
  console.log(`${user_id} \n ${company_id}`);

  if (snapshot.size === 0) {
    console.log(
      `No affiliation found for user ${user_id} and company ${company_id}`
    );
    return res.status(404).send({
      status: 404,
      error: `No affiliation found for user ${user_id} and company ${company_id}`,
    });
  }

  const doc = snapshot.docs[0];
  doc.ref
    .delete()
    .then(() => {
      console.log(
        `Successfully deleted affiliation for user ${user_id} and company ${company_id}`
      );
      return res.status(204).send({
        status: 204,
        message: `Successfully deleted affiliation for user ${user_id} and company ${company_id}`,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        status: 500,
        message: err,
      });
    });
};
