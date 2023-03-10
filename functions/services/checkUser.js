const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const userRef = db.collection("user");

exports.checkUser = (user_id) => {
  const found = userRef.doc(user_id);
  if (found.exists) {
    return true;
  } else if (!found.exists) {
    return false;
  }
};
