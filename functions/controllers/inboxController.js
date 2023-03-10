const { v4: uuidv4 } = require("uuid");
const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();

const inboxRef = db.collection("conversation");

// Import Services
const { createConversation } = require("../services/createConversation");
// const { getConnections } = require("../services/getConnections");

// GET all documents in conversation where doc includes user_id
exports.getChats = (req, res) => {
  console.log(`array of docs`);
};

// DELETE certain user's conversation
exports.deleteChat = (req, res) => {
  console.log(`single doc tied to doc id & user id`);
};

// POST create a new conversation tied to user_id & recipient_id
exports.newChat = (req, res) => {
  console.log(`service will set new doc`);
};
