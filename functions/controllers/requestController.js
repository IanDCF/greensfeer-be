const { v4: uuidv4 } = require("uuid");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

const db = getFirestore();

const requestRef = db.collection("request");

// Import services
const { deleteRequest } = require("../services/deleteRequest");

// POST new connection request
exports.newRequest = (req, res) => {
  const request_id = uuidv4();
  const requester_id = req.params.user_id;
  //this assumes all user ids are sent to the front end, is there security risk in having ids in the browser?
  const addressee_id = req.body.addressee_id;
  const body = req.body.body;
  const status = "pending";
  const created_at = new Date().toISOString();

  const requestObj = {
    request_id,
    requester_id,
    addressee_id,
    body,
    status,
    created_at,
  };

  requestRef
    .doc(request_id)
    .set(requestObj)
    .then(() => {
      return res.status(201).send({
        status: 201,
        message: `connection request sent by ${requester_id}`,
      });
    });
};

// GET single user's connection requests
exports.getRequests = async (req, res) => {
  const user_id = req.params.user_id;
  /* once reused controller exports refactored to services: ensure the request is for a valid user
   if (!userRef.where('user_id', '==', user_id)){404 user not found}
   */
  const snapshot = await requestRef
    .where("addressee_id", "==", user_id)
    .where("status", "==", "pending")
    .get();
  if (snapshot.empty) {
    console.log(`No pending requests for ${user_id}`);
    return res.status(204).send({
      status: 204,
      message: `No pending requests for ${user_id}`,
    });
  }

  const result = snapshot.docs.map((doc) => doc.data());
  return res.status(200).send(result);
};

// PATCH connection request: accept & POST new connection, decline & delete request
exports.handleRequest = (req, res, next) => {
  //populate addressee_id from current user via token/auth
  const { addressee_id, request_id, status } = req.body;
  console.log(status);
  requestRef
    .doc(request_id)
    .get()
    .then((doc) => {
      const requestRecord = doc.data();
      if (
        status === "accept" &&
        doc.exists &&
        addressee_id === requestRecord.addressee_id
      ) {
        requestRef.doc(request_id).update({ status: status });
        return res.status(200).send(`updated`);
      }
      if (status === "decline") {
        deleteRequest(request_id)
          .then(() => {
            res.status(201).send(`request ${request_id} deleted`);
          })
          .then(() => {
            next();
          });
      }
      if (status === "pending") {
        return res.status(404).send({ error: "invalid connection request" });
      }
    })
    .then(() => {
      //call service to update connections
      console.log(`call service to update connections`);
      return;
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ error: "Server error" });
    });
};

// DELETE **once completed move this to a service
exports.deleteRequest = (req, res, next) => {
  //do I need next parameter?
  const { request_id } = req.body;
  //problem with syntax in here; how to structure to confirm doc exists & addressee matches before deleting?
  deleteRequest(request_id)
    .then(() => {
      res.sendStatus(201);
    })
    .then(() => {
      next();
    })
    .catch((e) => {
      res.status(500).send(`${e} controller catch`);
    });
};