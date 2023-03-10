const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const connectionRef = db.collection("connection");

// GET: all connections (user ids) of a single user
exports.getConnections = (user_id) => {
  const connections = [];

  return connectionRef
    .where("members", "array-contains", user_id)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const connection = doc.data().members;
        const userConnectionId = connection.filter((id) => id !== user_id)[0];
        connections.push(userConnectionId);
      });
      return connections;
    })
    .catch((err) => {
      console.error(err);
      throw new Error("Server error");
    });
};
