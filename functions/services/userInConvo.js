const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const inboxRef = db.collection('inbox')

exports.userInConvo = async (conversation_id, user_id) => {
  const found = await inboxRef.where('conversation_id', '==', conversation_id).where('members','array-contains',user_id).get();
  if (found.exists) {
    return true;
  } else if (!found.exists) {
    return false;
  }
};
