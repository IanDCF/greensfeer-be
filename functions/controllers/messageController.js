const { v4: uuidv4 } = require("uuid");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const db = getFirestore();
const { userInConvo } = require("../services/userInConvo");

const messageRef = db.collection("message");

// GET: all messages belonging to a single conversation_id
exports.getMessages = async (req, res) => {
  const conversation_id = req.params.conversation_id;

  try {
    // Query the database to get all message documents with the specified conversation_id
    const snapshot = await messageRef
      .where("conversation_id", "==", conversation_id)
      .get();

    // Extract entire message objects from the snapshot
    const messages = snapshot.docs.map((doc) => doc.data());

    // Return the messages in the response
    return res.status(200).send(messages);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Server error" });
  }
};

// POST: new message associated with one conversation_id from params
exports.newMessage = async (req, res) => {
  const message_id = uuidv4();
  conversation_id = req.params.conversation_id;
  const { sender_id, text } = req.body;
  created_at = new Date().toISOString();

  const messageObj = {
    message_id,
    conversation_id,
    sender_id,
    text,
    created_at,
  };
  if (!(await userInConvo(conversation_id, sender_id))) {
    return res.status(404).send({
      status: 404,
      message: `no coversation found to match sender ${sender_id}`,
    });
  }

  messageRef
    .doc(message_id)
    .set(messageObj)
    .then(() => {
      return res.status(201).send({
        status: 201,
        message: `Message: ${message_id} sent on conversation: ${conversation_id}`,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({ status: 500, error: `${error}` });
    });
};

// PATCH: update a message by message_id in params
exports.editMessage = (req, res) => {
  const message_id = req.params.message_id;
  const { text } = req.body;

  messageRef
    .doc(message_id)
    .update({
      text: text,
    })
    .then(() => {
      return res.status(200).send({
        status: 200,
        message: `Message: ${message_id} has been updated`,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({ status: 500, error: `${error}` });
    });
};

// DELETE: message by message_id in params
exports.deleteMessage = (req, res) => {
  const message_id = req.params.message_id;

  messageRef
    .doc(message_id)
    .delete()
    .then(() => {
      return res.status(204).send({
        status: 204,
        message: `Message: ${message_id} has been deleted`,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({ status: 500, error: `${error}` });
    });
};
