const { v4: uuidv4 } = require("uuid");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
const { getConnections } = require("../services/getConnections");

const db = getFirestore();

const connectionRef = db.collection("connection");

// POST: create new connection doc in 'connection' collection
exports.newConnection = (req, res) => {
  const connection_id = uuidv4();
  const user1_id = req.body.user1_id;
  const user2_id = req.body.user2_id;
  const connectionObj = {
    connection_id,
    members: [user1_id, user2_id],
    created_at: new Date().toISOString(),
  };
  connectionRef
    .doc(`${connection_id}`)
    .set(connectionObj)
    .then(() => {
      return res.status(201).send({
        status: 201,
        message: `User: ${user1_id} is now a connection of user: ${user2_id}`,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({ status: 500, error: `${error}` });
    });
};

// GET: all connections of a single user
exports.getUserConnections = async (req, res) => {
  const user_id = req.params.user_id;
  try {
    const connections = await getConnections(user_id);
    return res.status(200).send(connections);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Server error" });
  }
};

// DELETE: a single connection doc by passing connection document id
exports.deleteConnection = (req, res) => {
  const connection_id = req.params.connection_id;

  connectionRef
    .doc(connection_id)
    .delete()
    .then(() => {
      console.log(`Document: ${connection_id} deleted successfully`);
      return res.status(200).send({
        status: 200,
        message: `Document: ${connection_id} deleted successfully`,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ error: "Server error" });
    });
};
