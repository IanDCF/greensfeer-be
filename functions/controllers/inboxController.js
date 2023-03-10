const { v4: uuidv4 } = require("uuid");
const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();

const inboxRef = db.collection("conversation");

// Import Services
const { createConversation } = require("../services/createConversation");
const { checkUser } = require("../services/checkUser");
// const { getConnections } = require("../services/getConnections");

// GET all documents in conversation where doc includes user_id
exports.getChats = async (req, res) => {
  const user_id = req.params.user_id;
  const chats = await inboxRef
    .where("members", "array-contains", user_id)
    .get();
  if (chats.empty) {
    console.log(`No conversations for ${user_id}`);
    return res.status(204).send({
      status: 204,
      message: `No conversations for ${user_id}`,
    });
  }
  const result = chats.docs.map((doc) => doc.data());
  return res.status(200).send(result);
};

// DELETE certain user's conversation
exports.deleteChat = (req, res) => {
  console.log(`single doc tied to doc id & user id`);
};

// POST create a new conversation tied to user_id & recipient_id
exports.newChat = (req, res) => {
  console.log(`service will set new doc`);
};
