const { v4: uuidv4 } = require("uuid");
const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();

const inboxRef = db.collection("inbox");

// Import Services
const { checkUser } = require("../services/checkUser");

// GET all documents in conversation where doc includes user_id
exports.getChats = async (req, res) => {
  const user_id = req.params.user_id;
  const conversations = await inboxRef
    .where("members", "array-contains", user_id)
    .get();
  if (conversations.empty) {
    console.log(`No conversations for ${user_id}`);
    return res.status(204).send({
      status: 204,
      message: `No conversations for ${user_id}`,
    });
  }
  const result = conversations.docs.map((doc) => doc.data());
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
exports.newChat = async (req, res) => {
  // request structure: req.params.user_id = sender (members [0]), req.body.addressee = addressee (members [1]), conversation_id UUID, created_at, updated_at = time, seen = false
  const member0 = await req.params.member0;
  const member1 = await req.body.member1;
  const conversation_id = uuidv4();
  const time = new Date().toISOString();
  const seen = false;

  const conversationObj = {
    conversation_id,
    created_at: time,
    members: [member0, member1],
    seen,
    updated_at: time,
  };
  console.log(conversationObj);
  const checkExisting = inboxRef
    .where("members", "array-contains", member0)
    .where("members", "array-contains", member1)
    .get();

  if (checkExisting.exists) {
    console.log(
      "cannot query firestrore via multiple array-contains, need to restructure data or skip this validation"
    );
    return;
  }

  //   if (checkUser(member0) && checkUser(member1)) {
  inboxRef
    .doc(conversation_id)
    .set(conversationObj)
    .then(() => {
      return res.status(201).send({
        status: 201,
        message: `Conversation created between ${member0} & ${member1}`,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        status: 500,
        message: err,
      });
    });
};

// Future services associated with inbox: PATCH: update seen & updated at when there is a GET to messages associated with conversation
