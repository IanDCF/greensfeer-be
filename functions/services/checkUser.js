const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const userRef = db.collection("user");

exports.checkUser = async (user_id) => {
  const found = await userRef.doc(user_id);
  if (found.exists) {
    return true;
  } else if (!found.exists) {
    return false;
  }
};
