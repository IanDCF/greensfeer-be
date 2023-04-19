const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const userRef = db.collection("user");

exports.firstLastName = async (user_id) => {
  const found = await userRef.doc(user_id);
  const docRef = await found.get();
  const { first_name, last_name } = await docRef.data();
  const name = { first_name, last_name };
//   console.log(name);
  return name;
};
