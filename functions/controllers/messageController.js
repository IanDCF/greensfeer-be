const { v4: uuidv4 } = require("uuid");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const db = getFirestore();

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

// POST: new message associated with conversation_id
exports.newMessage = (req, res) => {
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

// PATCH: **Future feature: update a certain message by message_id
exports.editMessage = (req, res) => {
  console.log("future feature");
};
// DELETE: **Future feature: delete a certain message by message_id
exports.deleteMessage = (req, res) => {
  console.log("future feature");
};
