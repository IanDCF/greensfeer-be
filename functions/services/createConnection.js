const { v4: uuidv4 } = require("uuid");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const connectionRef = db.collection("connection");

// POST: create new connection doc in 'connection' collection
exports.createConnection = (user1_id, user2_id) => {
  const connection_id = uuidv4();
  const connectionObj = {
    members: [user1_id, user2_id],
    created_at: new Date().toISOString(),
  };
  return connectionRef
    .doc(`${connection_id}`)
    .set(connectionObj)
    .then(() => {
      return {
        status: 201,
        message: `User: ${user1_id} is now a connection of user: ${user2_id}`,
      };
    })
    .catch((error) => {
      console.error(error);
      throw new Error(error);
    });
};
