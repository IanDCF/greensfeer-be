const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();

const requestRef = db.collection("request");

exports.deleteRequest = (requestId) => {
  return requestRef
    .doc(requestId)
    .delete({ exists: true })
    .catch((err) => {
      throw new Error(`${err.message} service error`);
    });
};
