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
  const conversation_id = req.params.conversation_id;
  inboxRef
    .doc(conversation_id)
    .delete()
    .then(() => {
      return res.status(201).send({
        status: 201,
        message: `conversation ${conversation_id} deleted`,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        status: 500,
        message: err,
      });
    });
};

// POST create a new conversation tied to user_id & recipient_id
exports.newChat = (req, res) => {
  // request structure: req.params.user_id = sender (members [0]), req.body.recipient = addressee (members [1]), conversation_id UUID, created_at, updated_at = time, seen = false
  console.log(`service will set new doc`);
};

// Future services associated with inbox: PATCH: update seen & updated at when there is a GET to messages associated with conversation
